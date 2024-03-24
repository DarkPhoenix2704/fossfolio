/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Events` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Events_slug_key" ON "Events"("slug");
