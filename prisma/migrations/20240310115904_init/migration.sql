/*
  Warnings:

  - You are about to drop the column `courseId` on the `attachment` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `test` table. All the data in the column will be lost.
  - Added the required column `chapterId` to the `attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapterId` to the `test` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `attachment` DROP FOREIGN KEY `Attachment_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `test` DROP FOREIGN KEY `Test_courseId_fkey`;

-- AlterTable
ALTER TABLE `attachment` DROP COLUMN `courseId`,
    ADD COLUMN `chapterId` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `course` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `test` DROP COLUMN `courseId`,
    ADD COLUMN `chapterId` BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX `Attachment_chapterId_idx` ON `attachment`(`chapterId`);

-- CreateIndex
CREATE INDEX `Test_chapterId_idx` ON `test`(`chapterId`);

-- AddForeignKey
ALTER TABLE `attachment` ADD CONSTRAINT `Attachment_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test` ADD CONSTRAINT `Test_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
