# 🚀 Lumora Backend Structure

```bash
📁 lumora-backend  # Корень проекта
├── 📁 prisma            # Prisma schema & seed
│   ├── 📄 schema.prisma  # Схема БД
│   └── 📄 seed.ts        # Начальные данные
├── 📁 src                # Исходники приложения
│   ├── 📁 core           # Базовые сервисы и глобальные вещи
│   │   ├── ⚙️ config        # Настройки приложения
│   │   ├── 🛡 filters       # Фильтры и interceptors
│   │   ├── 🌀 graphql       # Глобальные GraphQL элементы
│   │   ├── 🔒 guards        # Гварды (Auth, Roles)
│   │   ├── 🧹 pipes         # Валидационные пайпы
│   │   ├── 📦 prisma        # Prisma client wrapper
│   │   ├── 📝 types         # Общие типы
│   │   └── 📄 core.module.ts # Core модуль NestJS
│   ├── 📁 modules        # Фичи/бизнес-модули
│   │   ├── 📁 article
│   │   ├── 📁 auth
│   │   ├── 📁 category
│   │   ├── 📁 comment
│   │   ├── 📁 health
│   │   ├── 📁 mail
│   │   ├── 📁 upload
│   │   ├── 📁 user
│   │   └── 📄 index.ts    # Экспорт модулей
│   ├── 📁 shared         # Общие утилиты и DTO
│   │   ├── 📦 dto
│   │   └── 🛠 utils
│   └── 📄 main.ts        # Точка входа приложения
├── 📄 Dockerfile
├── 📄 README.md
├── 📄 docker-compose.yml
├── 📄 eslint.config.mjs
├── 📄 nest-cli.json
├── 📄 package.json
├── 📄 pnpm-lock.yaml
├── 📄 tsconfig.build.json
└── 📄 tsconfig.json
