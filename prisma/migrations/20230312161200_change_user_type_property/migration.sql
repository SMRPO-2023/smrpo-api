/*
  Warnings:

  - You are about to drop the column `usertype` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "usertype",
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'USER';
