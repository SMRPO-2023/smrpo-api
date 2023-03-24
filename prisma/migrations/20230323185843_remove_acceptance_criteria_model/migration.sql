/*
  Warnings:

  - You are about to drop the `AcceptanceCriteria` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AcceptanceCriteria" DROP CONSTRAINT "AcceptanceCriteria_userStoryId_fkey";

-- AlterTable
ALTER TABLE "UserStory" ADD COLUMN     "acceptanceCriteria" TEXT;

-- DropTable
DROP TABLE "AcceptanceCriteria";
