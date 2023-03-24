/*
  Warnings:

  - You are about to drop the column `implemented` on the `UserStory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserStory" DROP COLUMN "implemented",
ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false;
