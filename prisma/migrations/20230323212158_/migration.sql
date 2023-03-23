/*
  Warnings:

  - You are about to drop the column `accepted` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `accepted` on the `UserStory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "accepted",
ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserStory" DROP COLUMN "accepted",
ADD COLUMN     "acceptanceTest" BOOLEAN NOT NULL DEFAULT false;
