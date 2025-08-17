import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { generateSlug } from '@/shared/utils';

const prisma = new PrismaClient();

async function main() {
  // 🔸 Создаём 5 категорий
  const categories = await Promise.all(
    Array.from({ length: 5 }).map(() => {
      const name = faker.commerce.department();
      return prisma.category.create({
        data: {
          name,
          slug: generateSlug(name),
        },
      });
    }),
  );

  // 🔸 Создаём 10 юзеров
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          avatar: faker.image.avatar(),
        },
      }),
    ),
  );

  // 🔸 Создаём 20 статей
  const articles = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const author = faker.helpers.arrayElement(users);
      const category = faker.helpers.arrayElement(categories);

      const title = faker.lorem.sentence();
      const slug = faker.helpers.slugify(title.toLowerCase());

      return prisma.article.create({
        data: {
          title,
          slug,
          description: faker.lorem.paragraph(),
          content: faker.lorem.paragraphs(5),
          tags: faker.helpers.arrayElements(['tech', 'life', 'dev', 'news'], 2),
          coverImage: faker.image.urlPicsumPhotos(),
          published: faker.datatype.boolean(),
          publishedAt: faker.date.recent(),
          readingTime: faker.number.int({ min: 1, max: 10 }),
          views: faker.number.int({ min: 1000, max: 30000 }),
          likes: faker.number.int({ min: 1000, max: 100000 }),
          authorId: author.id,
          categoryId: category.id,
        },
      });
    }),
  );

  // 🔸 Создаём комментарии
  await Promise.all(
    Array.from({ length: 100 }).map(() => {
      const author = faker.helpers.arrayElement(users);
      const article = faker.helpers.arrayElement(articles);

      return prisma.comment.create({
        data: {
          content: faker.lorem.sentences(2),
          authorId: author.id,
          articleId: article.id,
        },
      });
    }),
  );

  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
