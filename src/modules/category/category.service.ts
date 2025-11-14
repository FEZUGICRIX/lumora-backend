import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '@/core/prisma/prisma.service'

import { CreateCategoryInput } from './dto/create-category.input'
import { UpdateCategoryInput } from './dto/update-category.input'

import { generateSlug } from '@/common/utils'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	create(createCategoryInput: CreateCategoryInput) {
		const slug = generateSlug(createCategoryInput.name)
		return this.prisma.category.create({
			data: { ...createCategoryInput, slug },
		})
	}

	findAll() {
		return this.prisma.category.findMany()
	}

	findOne(slug: string) {
		return this.prisma.category.findUnique({
			where: { slug },
		})
	}

	update(id: string, updateCategoryInput: UpdateCategoryInput) {
		const data: Prisma.CategoryUpdateInput = { ...updateCategoryInput }

		if (updateCategoryInput.name) {
			data.slug = generateSlug(updateCategoryInput.name)
		}

		return this.prisma.category.update({
			where: { id },
			data,
		})
	}

	remove(id: string) {
		return this.prisma.category.delete({
			where: { id },
		})
	}
}
