import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateUser, authorizeSpaceOwner } from "../middleware/auth";
import { handleError } from "../utils/errorHandler";

const router = Router();
const prisma = new PrismaClient();
router.post("/create", authenticateUser, async (req, res) => {
  const {
    spaceName,
    headerTitle,
    customMessage,
    question1,
    question2,
    question3,
  } = req.body;

  // Use the authenticated user's ID
  const userId = req.user!.id;

  try {
    // Check if space name already exists for this user
    const existingSpace = await prisma.space.findFirst({
      where: {
        spaceName,
        userId,
      },
    });

    if (existingSpace) {
      return res.status(409).json({ error: "Space name already exists" });
    }

    const space = await prisma.space.create({
      data: {
        userId,
        spaceName,
        headerTitle,
        customMessage,
        question1,
        question2,
        question3,
      },
    });
    res.status(201).json(space);
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/", authenticateUser, async (req, res) => {
  try {
    // Only return spaces belonging to the authenticated user
    const spaces = await prisma.space.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: {
        id: "desc",
      },
    });
    res.status(200).json(spaces);
  } catch (error) {
    handleError(error, res);
  }
});

router.get(
  "/:spaceName",
  authenticateUser,
  authorizeSpaceOwner,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // The space is already loaded and verified by authorizeSpaceOwner middleware
      const space = await prisma.space.findFirst({
        where: {
          spaceName: req.params.spaceName,
          userId: req.user!.id,
        },
        include: { testimonials: true },
      });

      res.status(200).json(space);
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Public endpoint for fetching space data (no authentication required)
router.get(
  "/public/:spaceName",
  async (req: Request, res: Response): Promise<void> => {
    const { spaceName } = req.params;
    try {
      const space = await prisma.space.findFirst({
        where: { spaceName },
        include: { testimonials: true },
      });

      if (!space) {
        res.status(404).json({ error: "Space not found" });
        return;
      }

      res.status(200).json(space);
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Public endpoint for submitting testimonials (no authentication required)
router.post(
  "/:spaceName/testimonials",
  async (req: Request, res: Response): Promise<void> => {
    const { spaceName } = req.params;
    const { content, image, name, email } = req.body;

    try {
      const space = await prisma.space.findFirst({
        where: { spaceName },
      });

      if (!space) {
        res.status(404).json({ error: "Space not found" });
        return;
      }

      const testimonial = await prisma.testimonial.create({
        data: {
          content,
          image,
          name,
          email,
          spaceId: space.id,
        },
      });

      res.status(201).json(testimonial);
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Protected endpoint for managing testimonials (requires authentication and ownership)
router.delete(
  "/:spaceName/testimonials/:testimonialId",
  authenticateUser,
  authorizeSpaceOwner,
  async (req: Request, res: Response): Promise<void> => {
    const { testimonialId } = req.params;

    try {
      const testimonial = await prisma.testimonial.findFirst({
        where: {
          id: testimonialId,
          space: {
            spaceName: req.params.spaceName,
            userId: req.user!.id,
          },
        },
      });

      if (!testimonial) {
        res.status(404).json({ error: "Testimonial not found" });
        return;
      }

      await prisma.testimonial.delete({
        where: {
          id: testimonialId,
        },
      });

      res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      handleError(error, res);
    }
  }
);

export const spaceRoutes = router;
