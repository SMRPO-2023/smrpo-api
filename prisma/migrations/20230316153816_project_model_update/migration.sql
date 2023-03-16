/*
  Warnings:

  - You are about to drop the `ProjectMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectMember" DROP CONSTRAINT "ProjectMember_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectMember" DROP CONSTRAINT "ProjectMember_userId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "projectOwnerId" INTEGER,
ADD COLUMN     "scrumMasterId" INTEGER;

-- DropTable
DROP TABLE "ProjectMember";

-- DropEnum
DROP TYPE "ProjectMemberRole";

-- CreateTable
CREATE TABLE "ProjectDeveloper" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ProjectDeveloper_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectDeveloper" ADD CONSTRAINT "ProjectDeveloper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDeveloper" ADD CONSTRAINT "ProjectDeveloper_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectOwnerId_fkey" FOREIGN KEY ("projectOwnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_scrumMasterId_fkey" FOREIGN KEY ("scrumMasterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
