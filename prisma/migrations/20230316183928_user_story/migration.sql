/*
  Warnings:

  - You are about to drop the column `acceptanceCriteriaId` on the `UserStory` table. All the data in the column will be lost.
  - You are about to drop the column `importance` on the `UserStory` table. All the data in the column will be lost.
  - You are about to drop the column `realised` on the `UserStory` table. All the data in the column will be lost.
  - Added the required column `priority` to the `UserStory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StoryPriority" AS ENUM ('MUST_HAVE', 'COULD_HAVE', 'SHOULD_HAVE', 'WONT_HAVE');

-- DropForeignKey
ALTER TABLE "UserStory" DROP CONSTRAINT "UserStory_acceptanceCriteriaId_fkey";

-- AlterTable
ALTER TABLE "UserStory" DROP COLUMN "acceptanceCriteriaId",
DROP COLUMN "importance",
DROP COLUMN "realised",
ADD COLUMN     "businessValue" TEXT,
ADD COLUMN     "implemented" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" "StoryPriority" NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "points" DROP NOT NULL;

-- DropEnum
DROP TYPE "StoryImportance";

-- AddForeignKey
ALTER TABLE "AcceptanceCriteria" ADD CONSTRAINT "AcceptanceCriteria_userStoryId_fkey" FOREIGN KEY ("userStoryId") REFERENCES "UserStory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
