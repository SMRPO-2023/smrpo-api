/*
  Warnings:

  - Made the column `projectOwnerId` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `scrumMasterId` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_projectOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_scrumMasterId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "projectOwnerId" SET NOT NULL,
ALTER COLUMN "scrumMasterId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectOwnerId_fkey" FOREIGN KEY ("projectOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_scrumMasterId_fkey" FOREIGN KEY ("scrumMasterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
