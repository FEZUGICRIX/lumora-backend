# Stage 1: Build
FROM node:24.4.1-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm prisma generate
RUN pnpm build

# Stage 2: Production
FROM node:24.4.1-alpine
WORKDIR /app

ARG RUNTIME_ENV=
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Копируем .env только в локальном режиме, если файл есть
RUN if [ "$RUNTIME_ENV" = "docker" ] && [ -f .env ]; then \
      echo "Using local .env"; \
      cp .env .env; \
    else \
      echo "Using platform ENV variables"; \
    fi

EXPOSE 4200
CMD ["node", "dist/src/main.js"]
