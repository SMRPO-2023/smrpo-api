/*
  Warnings:

  - Made the column `projectId` on table `UserStory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserStory" DROP CONSTRAINT "UserStory_projectId_fkey";

-- AlterTable
ALTER TABLE "UserStory" ALTER COLUMN "projectId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "UserStory" ADD CONSTRAINT "UserStory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
