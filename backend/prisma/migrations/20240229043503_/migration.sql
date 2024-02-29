/*
  Warnings:

  - You are about to drop the column `name` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "name",
ADD COLUMN     "content" TEXT NOT NULL DEFAULT '';
