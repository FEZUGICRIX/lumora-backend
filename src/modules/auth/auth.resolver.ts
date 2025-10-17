import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { RegisterInput } from './dto/register.input';
import type { Request } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  register(
    @Args('registerInput') dto: RegisterInput,
    @Context('req') req: Request,
  ) {
    return this.authService.register(dto, req);
  }

  // @Mutation(() => User)
  // async login(
  //   @Args('email') email: string,
  //   @Args('password') password: string,
  //   @Context() context: { req: Request },
  // ) {
  //   return this.authService.login(email, password, context.req);
  // }

  // @Mutation(() => Boolean)
  // async logout(@Context() context: { req: Request }) {
  //   return this.authService.logout(context.req);
  // }
}
