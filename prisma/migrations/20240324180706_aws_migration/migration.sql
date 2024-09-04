-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relay_modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `moduleName` VARCHAR(20) NOT NULL,
    `moduleState` VARCHAR(20) NOT NULL,
    `moduleStatus` VARCHAR(20) NOT NULL,
    `moduleMac` VARCHAR(20) NOT NULL,
    `moduleIP` VARCHAR(16) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `relay_modules_moduleMac_key`(`moduleMac`),
    UNIQUE INDEX `relay_modules_moduleIP_key`(`moduleIP`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `irgb_modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `moduleName` VARCHAR(20) NOT NULL,
    `moduleState` VARCHAR(20) NOT NULL,
    `moduleStatus` VARCHAR(20) NOT NULL,
    `moduleMac` VARCHAR(20) NOT NULL,
    `moduleIP` VARCHAR(16) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `irgb_modules_moduleMac_key`(`moduleMac`),
    UNIQUE INDEX `irgb_modules_moduleIP_key`(`moduleIP`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inputs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numInput` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `relayModuleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `output_relays` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `relayModuleId` INTEGER NULL,
    `outputFunction` VARCHAR(191) NULL DEFAULT 'Undefined',
    `outputType` VARCHAR(191) NULL,
    `numOutput` INTEGER NOT NULL,
    `timeOn` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `outputState` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `output_rgbs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `irgbModuleId` INTEGER NULL,
    `numOutput` INTEGER NOT NULL,
    `color` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `output_irs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `irgbModuleId` INTEGER NULL,
    `outputType` VARCHAR(20) NOT NULL,
    `numOutput` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devices_load` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `outputId` INTEGER NOT NULL,
    `spaceId` INTEGER NOT NULL,
    `inputId` INTEGER NULL,
    `status` VARCHAR(191) NULL,
    `inputTrigger` VARCHAR(10) NULL,
    `deviceType` VARCHAR(64) NOT NULL,
    `deviceName` VARCHAR(64) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `pairId` VARCHAR(15) NULL,

    UNIQUE INDEX `devices_load_outputId_key`(`outputId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devices_ir` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `outputIrId` INTEGER NOT NULL,
    `spaceId` INTEGER NOT NULL,
    `deviceName` VARCHAR(24) NOT NULL,
    `deviceIrType` VARCHAR(24) NOT NULL,
    `inputId` INTEGER NULL,
    `status` VARCHAR(191) NULL,
    `inputTrigger` VARCHAR(10) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `pairId` VARCHAR(15) NULL,

    UNIQUE INDEX `devices_ir_outputIrId_key`(`outputIrId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spaces` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `spaceName` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `spaces_spaceName_key`(`spaceName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `eventType` VARCHAR(32) NOT NULL,
    `isInstantaneos` BOOLEAN NOT NULL DEFAULT false,
    `eventName` VARCHAR(32) NOT NULL,
    `deviceIrId` INTEGER NULL,
    `deviceLoadId` INTEGER NULL,
    `inputId` INTEGER NULL,
    `outputId` INTEGER NULL,
    `sceneId` INTEGER NULL,
    `startTime` DATETIME(3) NULL,
    `endTime` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `inputType` VARCHAR(10) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `checked` BOOLEAN NOT NULL DEFAULT true,
    `deviceId` INTEGER NOT NULL,
    `deviceLoadId` INTEGER NOT NULL,
    `deviceName` VARCHAR(191) NOT NULL,
    `eventName` VARCHAR(191) NOT NULL,
    `mode` VARCHAR(191) NOT NULL,
    `stateName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `value` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scenes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `spaceId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `sceneName` VARCHAR(32) NOT NULL,
    `sceneImg` VARCHAR(80) NULL,

    UNIQUE INDEX `scenes_spaceId_key`(`spaceId`),
    UNIQUE INDEX `scenes_sceneName_key`(`sceneName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DeviceToScene` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DeviceToScene_AB_unique`(`A`, `B`),
    INDEX `_DeviceToScene_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `relay_modules` ADD CONSTRAINT `relay_modules_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `irgb_modules` ADD CONSTRAINT `irgb_modules_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inputs` ADD CONSTRAINT `inputs_relayModuleId_fkey` FOREIGN KEY (`relayModuleId`) REFERENCES `relay_modules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `output_relays` ADD CONSTRAINT `output_relays_relayModuleId_fkey` FOREIGN KEY (`relayModuleId`) REFERENCES `relay_modules`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `output_rgbs` ADD CONSTRAINT `output_rgbs_irgbModuleId_fkey` FOREIGN KEY (`irgbModuleId`) REFERENCES `irgb_modules`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `output_irs` ADD CONSTRAINT `output_irs_irgbModuleId_fkey` FOREIGN KEY (`irgbModuleId`) REFERENCES `irgb_modules`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices_load` ADD CONSTRAINT `devices_load_outputId_fkey` FOREIGN KEY (`outputId`) REFERENCES `output_relays`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices_load` ADD CONSTRAINT `devices_load_spaceId_fkey` FOREIGN KEY (`spaceId`) REFERENCES `spaces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices_load` ADD CONSTRAINT `devices_load_inputId_fkey` FOREIGN KEY (`inputId`) REFERENCES `inputs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices_ir` ADD CONSTRAINT `devices_ir_outputIrId_fkey` FOREIGN KEY (`outputIrId`) REFERENCES `output_irs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices_ir` ADD CONSTRAINT `devices_ir_spaceId_fkey` FOREIGN KEY (`spaceId`) REFERENCES `spaces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices_ir` ADD CONSTRAINT `devices_ir_inputId_fkey` FOREIGN KEY (`inputId`) REFERENCES `inputs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spaces` ADD CONSTRAINT `spaces_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_deviceIrId_fkey` FOREIGN KEY (`deviceIrId`) REFERENCES `devices_ir`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_deviceLoadId_fkey` FOREIGN KEY (`deviceLoadId`) REFERENCES `devices_load`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_inputId_fkey` FOREIGN KEY (`inputId`) REFERENCES `inputs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_outputId_fkey` FOREIGN KEY (`outputId`) REFERENCES `output_relays`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_sceneId_fkey` FOREIGN KEY (`sceneId`) REFERENCES `scenes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scenes` ADD CONSTRAINT `scenes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scenes` ADD CONSTRAINT `scenes_spaceId_fkey` FOREIGN KEY (`spaceId`) REFERENCES `spaces`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DeviceToScene` ADD CONSTRAINT `_DeviceToScene_A_fkey` FOREIGN KEY (`A`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DeviceToScene` ADD CONSTRAINT `_DeviceToScene_B_fkey` FOREIGN KEY (`B`) REFERENCES `scenes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
