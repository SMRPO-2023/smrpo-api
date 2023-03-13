-- DropForeignKey
ALTER TABLE "UserStory" DROP CONSTRAINT "UserStory_sprintId_fkey";

-- AlterTable
ALTER TABLE "Sprint" ADD COLUMN     "userStoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_userStoryId_fkey" FOREIGN KEY ("userStoryId") REFERENCES "UserStory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
