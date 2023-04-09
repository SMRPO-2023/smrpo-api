/*
  Warnings:

  - Added the required column `remaningHours` to the `TimeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeLog" ADD COLUMN     "remaningHours" DOUBLE PRECISION NOT NULL;
