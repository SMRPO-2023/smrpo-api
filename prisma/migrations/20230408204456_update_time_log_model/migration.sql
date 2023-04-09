/*
  Warnings:

  - Made the column `userId` on table `TimeLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `taskId` on table `TimeLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_userId_fkey";

-- AlterTable
ALTER TABLE "TimeLog" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "taskId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
