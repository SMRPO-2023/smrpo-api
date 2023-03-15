-- DropForeignKey
ALTER TABLE "UserStory" DROP CONSTRAINT "UserStory_acceptanceCriteriaId_fkey";

-- AlterTable
ALTER TABLE "UserStory" ALTER COLUMN "acceptanceCriteriaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserStory" ADD CONSTRAINT "UserStory_acceptanceCriteriaId_fkey" FOREIGN KEY ("acceptanceCriteriaId") REFERENCES "AcceptanceCriteria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
