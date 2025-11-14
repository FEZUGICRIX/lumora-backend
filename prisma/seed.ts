import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

import { HashService } from '../src/modules/auth/services/hash.service'

const prisma = new PrismaClient()

// Инициализация HashService для хеширования паролей
const hashService = new HashService()
const hashPassword = (password: string) => hashService.hashPassword(password)

// Функция для генерации slug
function generateSlug(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

// Уникальные названия категорий чтобы избежать дубликатов
const UNIQUE_CATEGORIES = [
	'Technology',
	'Programming',
	'Design',
	'Business',
	'Lifestyle',
	'Science',
	'Health',
	'Education',
	'Entertainment',
	'Sports',
]

// Генерация JSON контента для TipTap
function generateTiptapJsonContent(): any {
	const paragraphs = faker.number.int({ min: 3, max: 8 })

	return {
		type: 'doc',
		content: Array.from({ length: paragraphs }).map(() => ({
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: faker.lorem.paragraph(),
				},
			],
		})),
	}
}

// Генерация HTML контента
function generateHtmlContent(): string {
	const paragraphs = faker.number.int({ min: 3, max: 8 })

	return Array.from({ length: paragraphs })
		.map(() => `<p>${faker.lorem.paragraph()}</p>`)
		.join('')
}

async function main() {
	console.log('🌱 Starting seed...')

	// 🔸 Очищаем базу данных (осторожно!)
	await prisma.comment.deleteMany()
	await prisma.article.deleteMany()
	await prisma.category.deleteMany()
	await prisma.user.deleteMany()

	// 🔸 Создаём категории из уникального списка
	const categories = await Promise.all(
		UNIQUE_CATEGORIES.slice(0, 5).map(name => {
			return prisma.category.create({
				data: {
					name,
					slug: generateSlug(name),
				},
			})
		}),
	)

	console.log(`✅ Created ${categories.length} categories`)

	// 🔸 Создаём 10 юзеров
	const users = await Promise.all(
		Array.from({ length: 10 }).map(async () => {
			const passwordHash = await hashPassword(
				faker.internet.password({ length: 8 }),
			)

			return prisma.user.create({
				data: {
					email: faker.internet.email(),
					username: faker.internet.username(),
					firstName: faker.person.firstName(),
					lastName: faker.person.lastName(),
					avatar: faker.image.avatar(),
					passwordHash,
				},
			})
		}),
	)

	console.log(`✅ Created ${users.length} users`)

	// 🔸 Создаём 20 статей
	const articles = await Promise.all(
		Array.from({ length: 20 }).map(async () => {
			const author = faker.helpers.arrayElement(users)
			const category = faker.helpers.arrayElement(categories)

			const title = faker.lorem.sentence()
			const slug = generateSlug(title)

			const contentJson = generateTiptapJsonContent()
			const contentHtml = generateHtmlContent()
			const contentText = JSON.stringify(contentJson)
				.replace(/[{}"\[\]]/g, '')
				.substring(0, 500)

			const wordCount = contentText.split(/\s+/).length
			const readingTime = Math.ceil(wordCount / 200) // ~200 слов в минуту

			return prisma.article.create({
				data: {
					title,
					slug,
					description: faker.lorem.paragraph(),
					contentJson,
					contentHtml,
					contentText: contentText.substring(0, 1000), // Обрезаем до 1000 символов
					tags: faker.helpers.arrayElements(
						[
							'tech',
							'life',
							'dev',
							'news',
							'programming',
							'design',
							'business',
						],
						3,
					),
					coverImage: faker.image.urlLoremFlickr({ width: 800, height: 400 }),
					published: faker.datatype.boolean({ probability: 0.8 }), // 80% статей опубликованы
					publishedAt: faker.date.recent({ days: 30 }),
					readingTime,
					wordCount,
					views: faker.number.int({ min: 1000, max: 30000 }),
					likes: faker.number.int({ min: 100, max: 5000 }),
					authorId: author.id,
					categoryId: category.id,
				},
			})
		}),
	)

	console.log(`✅ Created ${articles.length} articles`)

	// 🔸 Создаём комментарии
	const comments = await Promise.all(
		Array.from({ length: 100 }).map(() => {
			const author = faker.helpers.arrayElement(users)
			const article = faker.helpers.arrayElement(articles)

			return prisma.comment.create({
				data: {
					content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
					authorId: author.id,
					articleId: article.id,
				},
			})
		}),
	)

	console.log(`✅ Created ${comments.length} comments`)

	console.log('🌱 Seed completed successfully!')
	console.log('📊 Statistics:')
	console.log(`   - Categories: ${categories.length}`)
	console.log(`   - Users: ${users.length}`)
	console.log(`   - Articles: ${articles.length}`)
	console.log(`   - Comments: ${comments.length}`)
}

main()
	.catch(e => {
		console.error('❌ Seed failed:')
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
