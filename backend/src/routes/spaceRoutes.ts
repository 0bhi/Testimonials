import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();
router.post("/create", async (req, res) => {
  const {
    userId,
    spaceName,
    headerTitle,
    customMessage,
    question1,
    question2,
    question3,
  } = req.body;
  try {
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
    res.status(200).json(space);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create space" });
  }
});

router.get("/", async (req, res) => {
  try {
    const spaces = await prisma.space.findMany();
    res.status(200).json(spaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch spaces" });
  }
});

router.get(
  "/:spaceName",
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
      console.error(error);
      res.status(500).json({ error: "Failed to fetch space" });
    }
  }
);

router.post(
  "/:spaceName",
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
      console.error(error);
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  }
);

export const spaceRoutes = router;
