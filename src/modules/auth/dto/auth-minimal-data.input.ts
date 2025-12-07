// src/auth/dto/auth-minimal-data.dto.ts
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AuthMinimalData {
	@Field(() => ID)
	id: string

	@Field()
	username: string
}
