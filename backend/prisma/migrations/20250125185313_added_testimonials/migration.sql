-- CreateTable
CREATE TABLE "Testimonial" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "spaceId" INTEGER NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
