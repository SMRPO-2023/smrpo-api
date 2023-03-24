/*
  Warnings:

  - Made the column `title` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `documentation` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "documentation" SET NOT NULL;
