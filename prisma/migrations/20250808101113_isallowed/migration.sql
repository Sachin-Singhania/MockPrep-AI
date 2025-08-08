-- AlterTable
ALTER TABLE "public"."Question" ALTER COLUMN "score" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isAllowed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Dashboard_userId_idx" ON "public"."Dashboard"("userId");

-- CreateIndex
CREATE INDEX "Interview_dashboardId_idx" ON "public"."Interview"("dashboardId");

-- CreateIndex
CREATE INDEX "Profile_dashboardId_idx" ON "public"."Profile"("dashboardId");

-- CreateIndex
CREATE INDEX "Project_profileId_idx" ON "public"."Project"("profileId");

-- CreateIndex
CREATE INDEX "WorkInfo_profileId_idx" ON "public"."WorkInfo"("profileId");
