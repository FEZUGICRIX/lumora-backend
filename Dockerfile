# Указываем Node-образ
FROM node:24.4.1-alpine

# Устанавливаем pnpm глобально
RUN corepack enable && corepack prepare pnpm@latest --activate

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install

# Копируем оставшиеся файлы
COPY . .

# Генерация Prisma-клиента
RUN pnpm prisma generate

# Компилируем TypeScript (если есть)
RUN pnpm build

# Экспонируем порт
EXPOSE 3000

# Команда запуска
CMD ["pnpm", "start:prod"]
