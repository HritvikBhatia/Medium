import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signupInput, signinInput } from "@hritvik707/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

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