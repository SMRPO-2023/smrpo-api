/*
  Warnings:

  - Made the column `description` on table `UserStory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `acceptanceCriteria` on table `UserStory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserStory" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "acceptanceCriteria" SET NOT NULL;
