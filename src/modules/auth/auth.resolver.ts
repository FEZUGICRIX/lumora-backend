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

  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  // signIn(@Body() signInDto: Record<string, any>) {
  //   return this.authService.signIn(signInDto.username, signInDto.password);
  // }
}
