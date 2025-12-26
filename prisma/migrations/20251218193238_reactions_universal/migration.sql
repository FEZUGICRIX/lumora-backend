/*
  Warnings:

  - You are about to drop the column `likes` on the `articles` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'LOVE', 'FIRE', 'BOOKMARK', 'LAUGH', 'WOW', 'SAD', 'ANGRY', 'POOP', 'CLOWN');

-- CreateEnum
CREATE TYPE "ReactionTargetType" AS ENUM ('ARTICLE', 'COMMENT', 'PROFILE');

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" "ReactionTargetType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reactions_targetId_type_idx" ON "reactions"("targetId", "type");

-- CreateIndex
CREATE INDEX "reactions_targetId_targetType_idx" ON "reactions"("targetId", "targetType");

-- CreateIndex
CREATE INDEX "reactions_targetType_idx" ON "reactions"("targetType");

-- CreateIndex
CREATE INDEX "reactions_userId_idx" ON "reactions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_userId_targetId_targetType_key" ON "reactions"("userId", "targetId", "targetType");

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
