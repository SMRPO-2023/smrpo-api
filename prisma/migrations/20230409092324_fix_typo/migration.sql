/*
  Warnings:

  - You are about to drop the column `remaningHours` on the `TimeLog` table. All the data in the column will be lost.
  - Added the required column `remainingHours` to the `TimeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeLog" DROP COLUMN "remaningHours",
ADD COLUMN     "remainingHours" DOUBLE PRECISION NOT NULL;
