import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@hritvik707/medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
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

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({
        message: "Input validation failed. Title or content is missing/invalid.",
      });
    }

    const authorId = c.get("userId");

    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(authorId),
        createdAt: new Date()
      },
    });

    return c.json({
      id: blog.id,
    }, 201);
  } catch (error) {
    console.error("Error creating blog:", error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred while creating the blog post.",
    });
  }
});

//post like blog 
blogRouter.post("/:id/like", async (c) => {

  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    
    if (isNaN(Number(id))) {
    c.status(400);
    return c.json({
      message: "Invalid blog ID. ",
    });
  }

    const authorId = c.get("userId");

    const updatedBlog = await prisma.blog.update({
      where:{
        id: Number(id)
      },
      data: {
        likedBy: { connect: { id: Number(authorId) } }
      },
    });

    return c.json({
      "message" : "Blog liked successfully",
      id: updatedBlog.id,
    }, 201);
  } catch (error) {
    console.error("Error Liking blog:", error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred while liking the blog post.",
    });
  }
});

// delete blog like
blogRouter.delete("/:id/like", async (c) => {

  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    
    if (isNaN(Number(id))) {
    c.status(400);
    return c.json({
      message: "Invalid blog ID. ",
    });
  }

    const authorId = c.get("userId");

    const updatedBlog = await prisma.blog.update({
      where:{
        id: Number(id)
      },
      data: {
        likedBy: { disconnect: { id: Number(authorId) } }
      },
    });

    return c.json({
      "message" : "Blog unliked successfully",
      id: updatedBlog.id,
    }, 201);
  } catch (error) {
    console.error("Error unLiking blog:", error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred while unliking the blog post.",
    });
  }
});

//add a bookmark
blogRouter.post("/:id/bookmark", async (c) => {

  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    
    if (isNaN(Number(id))) {
    c.status(400);
    return c.json({
      message: "Invalid blog ID. ",
    });
  }

    const authorId = c.get("userId");

    const updatedBlog = await prisma.blog.update({
      where:{
        id: Number(id)
      },
      data: {
        bookmarkedBy: { connect: { id: Number(authorId) } }
      },
    });

    return c.json({
      "message" : "Blog bookmarked successfully",
      id: updatedBlog.id,
    }, 201);
  } catch (error) {
    console.error("Error bookmarking blog:", error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred while bookmarking the blog post.",
    });
  }
});

// delete bookmark
blogRouter.delete("/:id/bookmark", async (c) => {

  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    
    if (isNaN(Number(id))) {
    c.status(400);
    return c.json({
      message: "Invalid blog ID. ",
    });
  }

    const authorId = c.get("userId");

    const updatedBlog = await prisma.blog.update({
      where:{
        id: Number(id)
      },
      data: {
        bookmarkedBy: { disconnect: { id: Number(authorId) } }
      },
    });

    return c.json({
      "message" : "Blog unmarked successfully",
      id: updatedBlog.id,
    }, 201);
  } catch (error) {
    console.error("Error unmarking blog:", error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred while unmarking the blog post.",
    });
  }
});


blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({
        message: "Input validation failed. ID, title, or content is missing/invalid.",
      });
    }
    
    const authorId = c.get("userId");


    const blog = await prisma.blog.update({
      where: {
        id: body.id,
        authorId: Number(authorId)
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({
      id: blog.id,
      message: "Blog post updated successfully."
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        c.status(404);
        return c.json({
            message: "Blog post not found or you do not have permission to update it.",
        });
    }

    console.error("Error updating blog:", error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred while updating the blog post.",
    });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.blog.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        createdAt: true,
        likedBy: {
          select:{
            username: true
          }
        },
        bookmarkedBy: {
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
        author: {
          select: {
            name: true,
          },
        },
        views: true
      },
    });

    return c.json({
      blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    c.status(500);
    return c.json({
      message: "Failed to fetch blog posts.",
    });
  }
});

blogRouter.get("/user", async (c) => {
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
        name: true,
        username: true
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
      message: "An unexpected error occurred while fetching user information.",
    });
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  if (isNaN(Number(id))) {
    c.status(400);
    return c.json({
      message: "Invalid blog ID format.",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        content: true,
        title: true,
        createdAt: true,
        likedBy: {
          select:{
            username: true
          }
        },
        bookmarkedBy: {
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
        author: {
          select: {
            name: true,
          },
        },
        views: true, 
      },
    });

    if (!blog) {
      c.status(404);
      return c.json({
        message: `Blog post with ID ${id} not found.`,
      });
    }

    return c.json({
      blog,
    });
  } catch (error) {
    console.error("Error fetching single blog:", error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred while fetching the blog post.",
    });
  }
});

blogRouter.patch("/:id/view", async (c) => {
  const id = c.req.param("id");

  if (isNaN(Number(id))) {
    c.status(400);
    return c.json({
      message: "Invalid blog ID format.",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    await prisma.blog.update({
      where: {
        id: Number(id),
      },
      data:{
        views:{
          increment: 1
        }
      }
    });

    return c.json({
      message: `view count + 1`,
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        c.status(404);
        return c.json({
            message: `Blog with ID ${id} not found `,
        });
    }
    c.status(500);
    return c.json({ error: "Failed to update views" });
  }
});

blogRouter.patch("/:id/tags", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  if (isNaN(Number(id))) {
    c.status(400);
    return c.json({ message: "Invalid blog ID format." });
  }

  try {
    const body = await c.req.json();
    const { addTags = [], removeTags = [] } = body;

    const authorId = c.get("userId");

    // Ensure the user owns this blog
    const blog = await prisma.blog.findFirst({
      where: { id: Number(id), authorId: Number(authorId) },
      select: { id: true },
    });

    if (!blog) {
      c.status(403);
      return c.json({
        message: "You do not have permission to modify tags for this blog.",
      });
    }

    // Create or connect tags to add
    const tagsToConnect = await Promise.all(
      addTags.map(async (title: string) => {
        const tag = await prisma.tag.upsert({
          where: { title },
          update: {},
          create: { title },
        });
        return { id: tag.id };
      })
    );

    // Find tags to disconnect (only if they exist)
    const tagsToDisconnect = await prisma.tag.findMany({
      where: { title: { in: removeTags } },
      select: { id: true },
    });

    // Update the blog
    const updatedBlog = await prisma.blog.update({
      where: { id: Number(id) },
      data: {
        tags: {
          connect: tagsToConnect,
          disconnect: tagsToDisconnect,
        },
      },
      include: { tags: true },
    });

    return c.json({
      message: "Tags updated successfully.",
      tags: updatedBlog.tags.map((t) => t.title),
    });
  } catch (error) {
    console.error("Error updating tags:", error);
    c.status(500);
    return c.json({
      message: "Failed to update tags.",
    });
  }
});


blogRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  if (isNaN(Number(id))) {
    c.status(400);
    return c.json({
      message: "Invalid blog ID format.",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    await prisma.blog.delete({
      where: {
        id: Number(id),
      },
    });

    return c.json({
      message: `Blog with ID ${id} deleted successfully`,
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        c.status(404);
        return c.json({
            message: `Blog with ID ${id} not found or you do not have permission to delete it.`,
        });
    }

    console.error("Error deleting blog:", error);
    c.status(500);
    return c.json({
      message: `Failed to delete blog with ID ${id} due to an internal error.`,
    });
  }
});