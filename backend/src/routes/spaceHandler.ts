import { Hono } from "hono";
import { createDb, spaces, testimonials } from "../db";
import {
  authenticateUser,
  authorizeSpaceOwner,
  AuthenticatedUser,
} from "../middleware/auth";
import { eq, and, desc } from "drizzle-orm";

interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

interface CreateSpaceBody {
  spaceName: string;
  headerTitle: string;
  customMessage: string;
  question1: string;
  question2: string;
  question3: string;
}

interface TestimonialBody {
  content: string;
  image?: string;
  name: string;
  email: string;
}

export const spaceRoutes = new Hono<{
  Bindings: Env;
  Variables: { user: AuthenticatedUser };
}>();

// Create space endpoint
spaceRoutes.post("/create", authenticateUser, async (c) => {
  try {
    const user = c.get("user");
    const env = c.env;
    const db = createDb(env.DATABASE_URL);

    const body = await c.req.json<CreateSpaceBody>();
    const {
      spaceName,
      headerTitle,
      customMessage,
      question1,
      question2,
      question3,
    } = body;

    // Check if space name already exists for this user
    const existingSpace = await db
      .select()
      .from(spaces)
      .where(and(eq(spaces.spaceName, spaceName), eq(spaces.userId, user.id)))
      .limit(1);

    if (existingSpace.length > 0) {
      return c.json({ error: "Space name already exists" }, 409);
    }

    const newSpace = await db
      .insert(spaces)
      .values({
        spaceName,
        headerTitle,
        customMessage,
        question1,
        question2,
        question3,
        userId: user.id,
      })
      .returning();

    return c.json(newSpace[0], 201);
  } catch (error) {
    console.error("Error in handleCreateSpace:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Get all spaces for authenticated user
spaceRoutes.get("/", authenticateUser, async (c) => {
  try {
    const user = c.get("user");
    const env = c.env;
    const db = createDb(env.DATABASE_URL);

    const userSpaces = await db
      .select()
      .from(spaces)
      .where(eq(spaces.userId, user.id))
      .orderBy(desc(spaces.createdAt));

    return c.json(userSpaces);
  } catch (error) {
    console.error("Error in handleGetSpaces:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Get public space (no authentication required) - must come before /:spaceName
spaceRoutes.get("/public/:spaceName", async (c) => {
  try {
    const spaceName = c.req.param("spaceName");
    const env = c.env;
    const db = createDb(env.DATABASE_URL);

    const space = await db
      .select()
      .from(spaces)
      .where(eq(spaces.spaceName, spaceName))
      .limit(1);

    if (space.length === 0) {
      return c.json({ error: "Space not found" }, 404);
    }

    const spaceData = space[0];
    const spaceTestimonials = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.spaceId, spaceData.id));

    return c.json({ ...spaceData, testimonials: spaceTestimonials });
  } catch (error) {
    console.error("Error in handleGetPublicSpace:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Get specific space with testimonials (authenticated) - must come after /public/:spaceName
spaceRoutes.get("/:spaceName", authenticateUser, async (c) => {
  try {
    const user = c.get("user");
    const spaceName = c.req.param("spaceName");
    const env = c.env;
    const db = createDb(env.DATABASE_URL);

    const space = await authorizeSpaceOwner(spaceName, user.id, env);
    if (!space) {
      return c.json(
        {
          error: "Access denied. Space not found or you don't own it.",
        },
        403
      );
    }

    // Get space with testimonials
    const spaceWithTestimonials = await db
      .select()
      .from(spaces)
      .where(and(eq(spaces.spaceName, spaceName), eq(spaces.userId, user.id)))
      .limit(1);

    if (spaceWithTestimonials.length === 0) {
      return c.json({ error: "Space not found" }, 404);
    }

    const spaceData = spaceWithTestimonials[0];
    const spaceTestimonials = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.spaceId, spaceData.id));

    return c.json({ ...spaceData, testimonials: spaceTestimonials });
  } catch (error) {
    console.error("Error in handleGetSpace:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Submit testimonial to a space (no authentication required)
spaceRoutes.post("/:spaceName/testimonials", async (c) => {
  try {
    const spaceName = c.req.param("spaceName");
    const env = c.env;
    const db = createDb(env.DATABASE_URL);

    const body = await c.req.json<TestimonialBody>();
    const { content, image, name, email } = body;

    const space = await db
      .select()
      .from(spaces)
      .where(eq(spaces.spaceName, spaceName))
      .limit(1);

    if (space.length === 0) {
      return c.json({ error: "Space not found" }, 404);
    }

    const newTestimonial = await db
      .insert(testimonials)
      .values({
        content,
        image,
        name,
        email,
        spaceId: space[0].id,
      })
      .returning();

    return c.json(newTestimonial[0], 201);
  } catch (error) {
    console.error("Error in handleSubmitTestimonial:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Delete testimonial (requires authentication and ownership)
spaceRoutes.delete(
  "/:spaceName/testimonials/:testimonialId",
  authenticateUser,
  async (c) => {
    try {
      const user = c.get("user");
      const spaceName = c.req.param("spaceName");
      const testimonialId = c.req.param("testimonialId");
      const env = c.env;
      const db = createDb(env.DATABASE_URL);

      const space = await authorizeSpaceOwner(spaceName, user.id, env);
      if (!space) {
        return c.json(
          {
            error: "Access denied. Space not found or you don't own it.",
          },
          403
        );
      }

      const testimonial = await db
        .select()
        .from(testimonials)
        .where(
          and(
            eq(testimonials.id, testimonialId),
            eq(testimonials.spaceId, space.id)
          )
        )
        .limit(1);

      if (testimonial.length === 0) {
        return c.json({ error: "Testimonial not found" }, 404);
      }

      await db.delete(testimonials).where(eq(testimonials.id, testimonialId));

      return c.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      console.error("Error in handleDeleteTestimonial:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
);
