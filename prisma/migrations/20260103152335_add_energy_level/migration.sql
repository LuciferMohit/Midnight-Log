/*
  Warnings:

  - The `status` column on the `MediaItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('BACKLOG', 'IN_PROGRESS', 'COMPLETED', 'DROPPED');

-- CreateEnum
CREATE TYPE "EnergyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "energyLevel" "EnergyLevel" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "MediaItem" DROP COLUMN "status",
ADD COLUMN     "status" "MediaStatus" NOT NULL DEFAULT 'BACKLOG';
