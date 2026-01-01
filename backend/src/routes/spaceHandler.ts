import { Router, Request, Response } from "express";
import { createDb, spaces, testimonials } from "../db";
import { authenticateUser, authorizeSpaceOwner } from "../middleware/auth";
import { eq, and, desc } from "drizzle-orm";
import { getDatabaseUrl } from "../config/env";

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

export const spaceRoutes = Router();

// Create space endpoint
spaceRoutes.post(
  "/create",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const db = createDb(getDatabaseUrl());

      const {
        spaceName,
        headerTitle,
        customMessage,
        question1,
        question2,
        question3,
      } = req.body as CreateSpaceBody;

      // Check if space name already exists for this user
      const existingSpace = await db
        .select()
        .from(spaces)
        .where(and(eq(spaces.spaceName, spaceName), eq(spaces.userId, user.id)))
        .limit(1);

      if (existingSpace.length > 0) {
        return res.status(409).json({ error: "Space name already exists" });
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

      return res.status(201).json(newSpace[0]);
    } catch (error) {
      console.error("Error in handleCreateSpace:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get all spaces for authenticated user
spaceRoutes.get("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const db = createDb(getDatabaseUrl());

    const userSpaces = await db
      .select()
      .from(spaces)
      .where(eq(spaces.userId, user.id))
      .orderBy(desc(spaces.createdAt));

    return res.json(userSpaces);
  } catch (error) {
    console.error("Error in handleGetSpaces:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get public space (no authentication required) - must come before /:spaceName
spaceRoutes.get("/public/:spaceName", async (req: Request, res: Response) => {
  try {
    const spaceName = req.params.spaceName;
    const db = createDb(getDatabaseUrl());

    const space = await db
      .select()
      .from(spaces)
      .where(eq(spaces.spaceName, spaceName))
      .limit(1);

    if (space.length === 0) {
      return res.status(404).json({ error: "Space not found" });
    }

    const spaceData = space[0];
    const spaceTestimonials = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.spaceId, spaceData.id));

    // Parse selectedTestimonials if it exists
    let selectedTestimonials: string[] = [];
    if (spaceData.selectedTestimonials) {
      try {
        selectedTestimonials = JSON.parse(spaceData.selectedTestimonials);
      } catch (e) {
        // If parsing fails, treat as empty array
        selectedTestimonials = [];
      }
    }

    // Filter testimonials based on selection (if any are selected)
    let filteredTestimonials = spaceTestimonials;
    if (selectedTestimonials.length > 0) {
      filteredTestimonials = spaceTestimonials.filter((t) =>
        selectedTestimonials.includes(t.id)
      );
    }

    return res.json({
      ...spaceData,
      testimonials: filteredTestimonials,
      selectedTestimonials: selectedTestimonials,
    });
  } catch (error) {
    console.error("Error in handleGetPublicSpace:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get specific space with testimonials (authenticated) - must come after /public/:spaceName
spaceRoutes.get(
  "/:spaceName",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const spaceName = req.params.spaceName;
      const databaseUrl = process.env.DATABASE_URL;

      if (!databaseUrl) {
        return res.status(500).json({ error: "Server configuration error" });
      }

      const db = createDb(databaseUrl);

      const space = await authorizeSpaceOwner(spaceName, user.id);
      if (!space) {
        return res.status(403).json({
          error: "Access denied. Space not found or you don't own it.",
        });
      }

      // Get space with testimonials
      const spaceWithTestimonials = await db
        .select()
        .from(spaces)
        .where(and(eq(spaces.spaceName, spaceName), eq(spaces.userId, user.id)))
        .limit(1);

      if (spaceWithTestimonials.length === 0) {
        return res.status(404).json({ error: "Space not found" });
      }

      const spaceData = spaceWithTestimonials[0];
      const spaceTestimonials = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.spaceId, spaceData.id));

      // Parse selectedTestimonials if it exists
      let selectedTestimonials: string[] = [];
      if (spaceData.selectedTestimonials) {
        try {
          selectedTestimonials = JSON.parse(spaceData.selectedTestimonials);
        } catch (e) {
          // If parsing fails, treat as empty array
          selectedTestimonials = [];
        }
      }

      return res.json({
        ...spaceData,
        testimonials: spaceTestimonials,
        selectedTestimonials: selectedTestimonials,
      });
    } catch (error) {
      console.error("Error in handleGetSpace:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Submit testimonial to a space (no authentication required)
spaceRoutes.post(
  "/:spaceName/testimonials",
  async (req: Request, res: Response) => {
    try {
      const spaceName = req.params.spaceName;
      const databaseUrl = process.env.DATABASE_URL;

      if (!databaseUrl) {
        return res.status(500).json({ error: "Server configuration error" });
      }

      const db = createDb(databaseUrl);

      const { content, image, name, email } = req.body as TestimonialBody;

      const space = await db
        .select()
        .from(spaces)
        .where(eq(spaces.spaceName, spaceName))
        .limit(1);

      if (space.length === 0) {
        return res.status(404).json({ error: "Space not found" });
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

      return res.status(201).json(newTestimonial[0]);
    } catch (error) {
      console.error("Error in handleSubmitTestimonial:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Update space template (requires authentication and ownership)
spaceRoutes.patch(
  "/:spaceName/template",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const spaceName = req.params.spaceName;
      const databaseUrl = process.env.DATABASE_URL;

      if (!databaseUrl) {
        return res.status(500).json({ error: "Server configuration error" });
      }

      const db = createDb(databaseUrl);

      const space = await authorizeSpaceOwner(spaceName, user.id);
      if (!space) {
        return res.status(403).json({
          error: "Access denied. Space not found or you don't own it.",
        });
      }

      const { template } = req.body as { template: string };

      if (!template) {
        return res.status(400).json({ error: "Template is required" });
      }

      const updatedSpace = await db
        .update(spaces)
        .set({ template })
        .where(and(eq(spaces.spaceName, spaceName), eq(spaces.userId, user.id)))
        .returning();

      if (updatedSpace.length === 0) {
        return res.status(404).json({ error: "Space not found" });
      }

      return res.json(updatedSpace[0]);
    } catch (error) {
      console.error("Error in handleUpdateTemplate:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Update selected testimonials (requires authentication and ownership)
spaceRoutes.patch(
  "/:spaceName/selected-testimonials",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const spaceName = req.params.spaceName;
      const databaseUrl = process.env.DATABASE_URL;

      if (!databaseUrl) {
        return res.status(500).json({ error: "Server configuration error" });
      }

      const db = createDb(databaseUrl);

      const space = await authorizeSpaceOwner(spaceName, user.id);
      if (!space) {
        return res.status(403).json({
          error: "Access denied. Space not found or you don't own it.",
        });
      }

      const { selectedTestimonials } = req.body as {
        selectedTestimonials: string[];
      };

      if (!Array.isArray(selectedTestimonials)) {
        return res
          .status(400)
          .json({ error: "selectedTestimonials must be an array" });
      }

      // Validate that all testimonial IDs exist for this space
      const spaceTestimonials = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.spaceId, space.id));

      const testimonialIds = spaceTestimonials.map((t) => t.id);
      const invalidIds = selectedTestimonials.filter(
        (id) => !testimonialIds.includes(id)
      );

      if (invalidIds.length > 0) {
        return res.status(400).json({
          error: `Invalid testimonial IDs: ${invalidIds.join(", ")}`,
        });
      }

      const updatedSpace = await db
        .update(spaces)
        .set({
          selectedTestimonials: JSON.stringify(selectedTestimonials),
        })
        .where(and(eq(spaces.spaceName, spaceName), eq(spaces.userId, user.id)))
        .returning();

      if (updatedSpace.length === 0) {
        return res.status(404).json({ error: "Space not found" });
      }

      return res.json({
        ...updatedSpace[0],
        selectedTestimonials: selectedTestimonials,
      });
    } catch (error) {
      console.error("Error in handleUpdateSelectedTestimonials:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Delete testimonial (requires authentication and ownership)
spaceRoutes.delete(
  "/:spaceName/testimonials/:testimonialId",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const spaceName = req.params.spaceName;
      const testimonialId = req.params.testimonialId;
      const databaseUrl = process.env.DATABASE_URL;

      if (!databaseUrl) {
        return res.status(500).json({ error: "Server configuration error" });
      }

      const db = createDb(databaseUrl);

      const space = await authorizeSpaceOwner(spaceName, user.id);
      if (!space) {
        return res.status(403).json({
          error: "Access denied. Space not found or you don't own it.",
        });
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
        return res.status(404).json({ error: "Testimonial not found" });
      }

      // Remove testimonial from selectedTestimonials if it exists
      let selectedTestimonials: string[] = [];
      if (space.selectedTestimonials) {
        try {
          selectedTestimonials = JSON.parse(space.selectedTestimonials);
        } catch (e) {
          // If parsing fails, treat as empty array
          selectedTestimonials = [];
        }
      }

      // Remove the deleted testimonial ID from the selection
      const updatedSelection = selectedTestimonials.filter(
        (id) => id !== testimonialId
      );

      // Update the space if the selection changed
      if (updatedSelection.length !== selectedTestimonials.length) {
        await db
          .update(spaces)
          .set({
            selectedTestimonials: JSON.stringify(updatedSelection),
          })
          .where(
            and(eq(spaces.spaceName, spaceName), eq(spaces.userId, user.id))
          );
      }

      await db.delete(testimonials).where(eq(testimonials.id, testimonialId));

      return res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      console.error("Error in handleDeleteTestimonial:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
