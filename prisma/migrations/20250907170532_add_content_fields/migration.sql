/*
  Warnings:

  - You are about to drop the column `assets` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `blockCount` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `characterCount` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `metaKeywords` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `wordCount` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Article" DROP COLUMN "assets",
DROP COLUMN "blockCount",
DROP COLUMN "characterCount",
DROP COLUMN "metaDescription",
DROP COLUMN "metaKeywords",
DROP COLUMN "metaTitle",
DROP COLUMN "status",
DROP COLUMN "wordCount",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "public"."ArticleStatus";
