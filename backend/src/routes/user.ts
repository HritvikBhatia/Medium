import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import {
  signupInput,
  signinInput
} from "@hritvik707/medium-common";
import { v4 as uuidv4 } from "uuid";

function getVerificationTokenExpiresAt(): Date {
  const EXPIRATION_HOURS = 1;
  const now = new Date();
  return new Date(now.getTime() + EXPIRATION_HOURS * 60 * 60 * 1000);
}

async function sendVerificationEmail(toEmail: string, token: string, c: any // Pass the context 'c' to access env
) {
  const magicLink = `https://medium-blog-puce.vercel.app/verify-email?token=${token}`; // TODO: Change for production
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, SENDER_EMAIL } = c.env;

  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !SENDER_EMAIL) {
    console.error("Gmail environment variables not set. Email not sent.");
    return;
  }

  // --- 1. Get a fresh Access Token from the Refresh Token ---
  let accessToken: string;
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: GMAIL_CLIENT_ID,
        client_secret: GMAIL_CLIENT_SECRET,
        refresh_token: GMAIL_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenResponse.ok) {
      const errorBody : any = await tokenResponse.json();
      throw new Error(`Failed to get access token: ${errorBody.error_description || 'Unknown error'}`);
    }

    const tokenData: { access_token: string } = await tokenResponse.json();
    accessToken = tokenData.access_token;

  } catch (error) {
    console.error("Error fetching Gmail access token:", error);
    return; // Fail silently
  }

  // --- 2. Construct and Send the Email ---
  const subject = "Verify your email";
  const htmlBody = `
    <h1>Welcome</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href="${magicLink}" target="_blank">Verify Your Email</a>
    <p>This link will expire in 1 hour.</p>
  `;

  // Gmail API requires a specific RFC 2822 format, Base64URL encoded.
  const emailMessage = [
    `From: "Clone" <${SENDER_EMAIL}>`,
    `To: ${toEmail}`,
    // Use Buffer for Base64 encoding in a Worker environment
    `Subject: =?utf-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: 7bit", // Keep HTML body simple
    "",
    htmlBody,
  ].join("\n");

  // The *entire* raw message must be Base64URL encoded
  const base64UrlMessage = Buffer.from(emailMessage, 'utf-8').toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  try {
    const sendResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        raw: base64UrlMessage,
      }),
    });

    if (!sendResponse.ok) {
      const errorBody:any = await sendResponse.json();
      console.error(`Failed to send Gmail: ${errorBody.error.message}`);
    } else {
      console.log(`Verification email sent successfully via Gmail to ${toEmail}`);
    }

  } catch (error) {
    console.error("Error sending Gmail:", error);
  }
}

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    FRONTEND_URL: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.use("/profile/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    c.status(401);
    return c.json({
      message: "Authentication header missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = await verify(token, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", String(user.id));
      await next();
    } else {
      c.status(403);
      return c.json({
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    c.status(403);
    return c.json({
      message: "Authentication failed. Invalid token.",
      error,
    });
  }
});

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const result = signupInput.safeParse(body);

    if (!result.success) {
      c.status(400);
      return c.json({
        message: "Invalid input for sign up.",
        details: result.error.issues,
      });
    }

    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name,
        verified: false, // User is not verified yet
      },
    });
    const verificationToken = await prisma.verificationToken.create({
      data: {
        token: `${uuidv4()}${uuidv4()}`, // A long, random token
        expiresAt: getVerificationTokenExpiresAt(),
        userId: user.id,
      },
    });

    await sendVerificationEmail(user.username, verificationToken.token, c);
    c.status(201);
    return c.json({
      message: "Account created. Please check your email to verify.",
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      c.status(409); // Conflict
      return c.json({
        message: "User with this username already exists.",
      });
    }

    console.error("Signup error:", error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred during sign up.",
    });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);

    if (!success) {
      c.status(400);
      return c.json({
        message: "Invalid input for sign in.",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
        password: body.password,
      },
    });

    if (!user) {
      c.status(401); // Unauthorized
      return c.json({
        message: "Invalid username or password.",
      });
    }

    if (!user.verified) {
      c.status(403);
      return c.json({
        message: "Please verify your email before logging in.",
      });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.text(jwt);
  } catch (error) {
    console.error("Sign-in error:", error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred during sign in.",
    });
  }
});

userRouter.post("/verify-email", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const { token } = await c.req.json();

    if (!token) {
      c.status(400);
      return c.json({ message: "Verification token is required." });
    }

    // 1. Find the token and include the user
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: String(token),
        expiresAt: {
          gt: new Date(), // Check if token has not expired
        },
      },
      include: {
        user: true,
      },
    });

    if (!verificationToken) {
      c.status(400);
      return c.json({ message: "Invalid or expired verification token." });
    }

    // 2. Mark the user as verified
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { verified: true },
    });

    // 3. Delete the used token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    // 4. Sign and return a JWT to log the user in
    const jwt = await sign({ id: verificationToken.userId }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (error) {
    console.error("Verification error:", error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred during email verification.",
    });
  }
});

/*get user(own) profile*/
userRouter.get("/profile", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const authorId = c.get("userId");

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(authorId),
      },
      select: {
        id: true,
        name: true,
        username: true,
        blog: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            likedBy: {
              select: {
                username: true,
              },
            },
            _count: {
              select: {
                likedBy: true,
                bookmarkedBy: true,
              },
            },
          },
        },
        likedBlogs: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
          },
        },
        bookmarkedBlogs: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            likedBlogs: true,
            bookmarkedBlogs: true,
          },
        },
      },
    });

    if (!user) {
      c.status(404);
      return c.json({
        message: "User not found.",
      });
    }
    return c.json({
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred during fetching user profile.",
    });
  }
});

/*get user(someone else) profile*/
userRouter.get("/:id/blogs", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const authorId = c.req.param("id");

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(authorId),
      },
      select: {
        id: true,
        name: true,
        username: true,
        blog: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            views: true,
          },
        },
      },
    });

    if (!user) {
      c.status(404);
      return c.json({
        message: "User not found.",
      });
    }
    return c.json({
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred during fetching user profile.",
    });
  }
});