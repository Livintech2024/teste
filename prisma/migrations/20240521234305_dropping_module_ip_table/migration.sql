/*
  Warnings:

  - You are about to drop the column `moduleIP` on the `irgb_modules` table. All the data in the column will be lost.
  - You are about to drop the column `moduleIP` on the `relay_modules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `irgb_modules` DROP COLUMN `moduleIP`;

-- AlterTable
ALTER TABLE `relay_modules` DROP COLUMN `moduleIP`;
