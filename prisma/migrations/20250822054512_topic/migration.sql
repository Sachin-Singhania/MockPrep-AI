/*
  Warnings:

  - Added the required column `topic` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "topic" TEXT NOT NULL;
