# Stage 1: Build
FROM node:24.4.1-alpine AS builder

# Рабочая директория
WORKDIR /app

# Устанавливаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копируем package.json и lock-файл
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем исходники
COPY . .

# Генерация Prisma-клиента
RUN pnpm prisma generate

# RUN pnpm prisma migrate deploy

# Компиляция TypeScript
RUN pnpm build

# Stage 2: Production
FROM node:24.4.1-alpine

WORKDIR /app

# Копируем node_modules из билд-образа
COPY --from=builder /app/node_modules ./node_modules

# Копируем скомпилированный код
COPY --from=builder /app/dist ./dist

# Копируем Prisma (миграции и schema)
COPY --from=builder /app/prisma ./prisma

# Копируем .env
COPY --from=builder /app/.env.docker ./

# Экспонируем порт
EXPOSE 4200

# Команда запуска
CMD ["node", "dist/src/main.js"]
