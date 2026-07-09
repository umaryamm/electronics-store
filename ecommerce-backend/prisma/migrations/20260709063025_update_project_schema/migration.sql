/*
  Warnings:

  - You are about to drop the column `badge` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `reviews` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `steps` on the `Project` table. All the data in the column will be lost.
  - Added the required column `title` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Project_categoryId_idx";

-- DropIndex
DROP INDEX "Project_level_idx";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "badge",
DROP COLUMN "categoryId",
DROP COLUMN "description",
DROP COLUMN "difficulty",
DROP COLUMN "duration",
DROP COLUMN "level",
DROP COLUMN "name",
DROP COLUMN "rating",
DROP COLUMN "reviews",
DROP COLUMN "steps",
ADD COLUMN     "completionDate" TIMESTAMP(3),
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "introDescription" TEXT,
ADD COLUMN     "introImageUrl" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNewArrival" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "sections" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'In Progress',
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Project_category_idx" ON "Project"("category");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");
