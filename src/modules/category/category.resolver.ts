import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CategoryService } from './category.service'

import { CreateCategoryInput } from './dto/create-category.input'
import { UpdateCategoryInput } from './dto/update-category.input'

import { Category } from './entities/category.entity'

@Resolver(() => Category)
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Mutation(() => Category)
	createCategory(
		@Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
	) {
		return this.categoryService.create(createCategoryInput)
	}

	@Query(() => [Category], { name: 'getCategories' })
	findAll() {
		return this.categoryService.findAll()
	}

	@Query(() => Category, { name: 'category' })
	findOne(@Args('slug', { type: () => String }) slug: string) {
		return this.categoryService.findOne(slug)
	}

	@Mutation(() => Category)
	updateCategory(
		@Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
	) {
		return this.categoryService.update(
			updateCategoryInput.id,
			updateCategoryInput,
		)
	}

	@Mutation(() => Category)
	removeCategory(@Args('id', { type: () => ID }) id: string) {
		return this.categoryService.remove(id)
	}
}
