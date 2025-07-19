/*
  Warnings:

  - You are about to drop the column `QuestionsAskedScore` on the `Analytics` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'FORMALCHAT';

-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "QuestionsAskedScore";
