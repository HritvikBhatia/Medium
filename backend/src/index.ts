import { Hono } from "hono";
import { cors } from "hono/cors";

import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use('/*', cors())

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

app.notFound((c) => {
  c.status(404);
  return c.json({
    message: "Route not found.",
  });
});

export default app;
