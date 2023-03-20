/*
  Warnings:

  - A unique constraint covering the columns `[userId,projectId]` on the table `ProjectDeveloper` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectDeveloper_userId_projectId_key" ON "ProjectDeveloper"("userId", "projectId");
