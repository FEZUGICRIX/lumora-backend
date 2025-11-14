import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Recaptcha } from '@nestlab/google-recaptcha'

import { PasswordRecoveryService } from './password-recovery.service'

import { NewPasswordInput } from './dto/new-password.input'
import { ResetPasswordInput } from './dto/reset-password.input'

@Resolver()
export class PasswordRecoveryResolver {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService,
	) {}

	@Mutation(() => Boolean)
	@Recaptcha()
	resetPassword(
		@Args('resetPasswordInput')
		dto: ResetPasswordInput,
	) {
		return this.passwordRecoveryService.resetPassword(dto)
	}

	@Mutation(() => Boolean)
	newPassword(
		@Args('newPasswordInput')
		dto: NewPasswordInput,
	) {
		return this.passwordRecoveryService.newPassword(dto)
	}
}
