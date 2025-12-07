-- 1. Удаляем устаревший уникальный индекс
-- Этот шаг, сгенерированный Prisma, верен.
DROP INDEX "accounts_provider_key";

-- 2. Добавляем новое поле как ОПЦИОНАЛЬНОЕ (TEXT)
-- Мы УДАЛЯЕМ NOT NULL, чтобы СУБД позволила добавить поле к существующим строкам с NULL.
-- AlterTable (Prisma)
ALTER TABLE "accounts" ADD COLUMN "provider_account_id" TEXT; -- ВАЖНО: УБРАТЬ NOT NULL;

-- 3. Заполнение данных для существующих строк (РЕШЕНИЕ)
-- Генерируем уникальный ID для всех старых записей, у которых поле NULL (те, что были до миграции).
-- Это временно позволит нам удовлетворить будущее ограничение NOT NULL и UNIQUE.
-- ВАЖНО: Здесь мы используем gen_random_uuid() и приводим его к TEXT.
UPDATE "accounts"
SET "provider_account_id" = gen_random_uuid()::TEXT
WHERE "provider_account_id" IS NULL;

-- 4. Устанавливаем ограничение NOT NULL
-- Теперь, когда все строки заполнены, мы можем сделать поле обязательным.
ALTER TABLE "accounts" ALTER COLUMN "provider_account_id" SET NOT NULL;

-- 5. Добавляем новый уникальный индекс
-- Этот шаг, сгенерированный Prisma, верен, и теперь он не упадет, так как поле заполнено.
-- CreateIndex (Prisma)
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");
