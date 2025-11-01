import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import type { Request } from 'express';

import { EmailConfirmationService } from './email-confirmation.service';
import { ConfirmationInput } from './dto/email-confirmation.input';

@Resolver()
export class EmailConfirmationResolver {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Mutation(() => Boolean)
  async newVerification(
    @Args('confirmationInput') dto: ConfirmationInput,
    @Context('req') req: Request,
  ): Promise<boolean> {
    return this.emailConfirmationService.newVerification(req, dto);
  }
}
