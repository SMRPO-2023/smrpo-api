/*
  Warnings:

  - The `businessValue` column on the `UserStory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserStory" DROP COLUMN "businessValue",
ADD COLUMN     "businessValue" INTEGER;
