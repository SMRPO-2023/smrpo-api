/*
  Warnings:

  - You are about to drop the column `done` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `hours` on the `Task` table. All the data in the column will be lost.
  - Added the required column `estimate` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "done",
DROP COLUMN "hours",
ADD COLUMN     "estimate" DOUBLE PRECISION NOT NULL;
