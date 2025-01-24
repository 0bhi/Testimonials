import express from "express";
import { PrismaClient } from "@prisma/client";
import { spaceRoutes } from "./routes/spaceRoutes";
const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/space", spaceRoutes);
app.get("/", async (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
  console.log(`Server is running on port ${port}`);
});
