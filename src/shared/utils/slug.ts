import { customAlphabet } from 'nanoid'
import slugify from 'slugify'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6)

export function generateSlug(title: string, withId = false): string {
	const slug = slugify(title, { lower: true, strict: true })
	return withId ? `${slug}-${nanoid()}` : slug
}
