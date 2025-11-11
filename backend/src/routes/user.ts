import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { signupInput, signinInput } from "@hritvik707/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
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
      error
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
      },
    });

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    c.status(201);
    return c.text(jwt);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
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
        blog:{
          select:{
            id:true,
            title: true,
            content: true,
            createdAt: true,
            likedBy: {
              select:{
                username: true
              }
            },
            _count: {
              select: { 
                likedBy: true,
                bookmarkedBy: true 
              },
            },
          }
        },
        likedBlogs: {
          select:{
            id: true,
            title: true,
            content: true,
            createdAt: true,
          }
        },
        bookmarkedBlogs: {
          select:{
            id: true,
            title: true,
            content: true,    
            createdAt: true,
          }
        },
        _count: {
          select:{
            likedBlogs: true,
            bookmarkedBlogs: true,
          }
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
        blog:{
          select:{
            id:true,
            title: true,
            content: true,
            createdAt: true,
            views: true,
          }
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