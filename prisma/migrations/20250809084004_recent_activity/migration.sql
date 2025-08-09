-- CreateEnum
CREATE TYPE "public"."RecentActivityType" AS ENUM ('INTERVIEW', 'PROFILE_UPDATED', 'DASHBOARD_CREATED');

-- CreateTable
CREATE TABLE "public"."RecentActivity" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "type" "public"."RecentActivityType" NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecentActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecentActivity_dashboardId_type_idx" ON "public"."RecentActivity"("dashboardId", "type");

-- AddForeignKey
ALTER TABLE "public"."RecentActivity" ADD CONSTRAINT "RecentActivity_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "public"."Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
