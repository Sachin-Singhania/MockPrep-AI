/*
  Warnings:

  - You are about to drop the column `WorkExperience` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "WorkExperience";

-- CreateTable
CREATE TABLE "WorkInfo" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "WorkInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkInfo" ADD CONSTRAINT "WorkInfo_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
