import { customAlphabet } from 'nanoid';
import slugify from 'slugify';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6);

export function generateSlug(title: string): string {
  const slug = slugify(title, { lower: true, strict: true });
  return `${slug}-${nanoid()}`;
}
