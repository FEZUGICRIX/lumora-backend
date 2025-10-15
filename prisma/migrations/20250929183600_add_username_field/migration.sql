/*
  Warnings:

  - You are about to drop the column `deviceInfo` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `redeemed` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."RefreshToken" DROP COLUMN "deviceInfo",
DROP COLUMN "redeemed",
ADD COLUMN     "replacedBy" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");
