import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Recaptcha } from '@nestlab/google-recaptcha';

import { PasswordRecoveryService } from './password-recovery.service';

import { ResetPasswordInput } from './dto/reset-password.input';
import { NewPasswordInput } from './dto/new-password.input';

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
    return this.passwordRecoveryService.resetPassword(dto);
  }

  @Mutation(() => Boolean)
  newPassword(
    @Args('newPasswordInput')
    dto: NewPasswordInput,
  ) {
    return this.passwordRecoveryService.newPassword(dto);
  }
}
