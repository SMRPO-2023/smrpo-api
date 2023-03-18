/*
  Warnings:

  - You are about to drop the column `userStoryId` on the `Sprint` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sprint" DROP CONSTRAINT "Sprint_userStoryId_fkey";

-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "userStoryId";

-- AddForeignKey
ALTER TABLE "UserStory" ADD CONSTRAINT "UserStory_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
