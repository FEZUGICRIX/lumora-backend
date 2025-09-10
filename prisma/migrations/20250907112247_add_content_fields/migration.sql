/*
  Warnings:

  - You are about to drop the column `content` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Article` table. All the data in the column will be lost.
  - Added the required column `contentHtml` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentJson` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentText` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "public"."Article" DROP COLUMN "content",
DROP COLUMN "deletedAt",
DROP COLUMN "published",
ADD COLUMN     "assets" JSONB,
ADD COLUMN     "blockCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "characterCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "contentHtml" TEXT NOT NULL,
ADD COLUMN     "contentJson" JSONB NOT NULL,
ADD COLUMN     "contentText" TEXT NOT NULL,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaKeywords" TEXT[],
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "status" "public"."ArticleStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "wordCount" INTEGER NOT NULL DEFAULT 0;
