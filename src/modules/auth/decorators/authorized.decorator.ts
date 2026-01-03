import { User } from '@prisma/generated'

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const Authorized = createParamDecorator(
	(data: keyof User | undefined, context: ExecutionContext) => {
		const ctx = GqlExecutionContext.create(context)
		const { req } = ctx.getContext()

		const user = req.user
		if (!user) return undefined

		return data ? user[data] : user
	},
)
