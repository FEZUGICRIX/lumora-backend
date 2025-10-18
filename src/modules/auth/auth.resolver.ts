import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import type { Request, Response } from 'express';

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

  @Mutation(() => User)
  login(
    @Args('loginInput') dto: LoginInput,
    @Context() context: { req: Request },
  ) {
    return this.authService.login(dto, context.req);
  }

  @Mutation(() => Boolean)
  logout(@Context() context: { req: Request; res: Response }) {
    return this.authService.logout(context.req, context.res);
  }
}
