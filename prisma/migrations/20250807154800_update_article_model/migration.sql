/*
  Warnings:

  - Made the column `description` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Article" ALTER COLUMN "description" SET NOT NULL;
