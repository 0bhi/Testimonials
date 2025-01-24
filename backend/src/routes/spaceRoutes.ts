import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
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
    res.status(500).json({ error: "Failed to create space" });
  }
});

export const spaceRoutes = router;
