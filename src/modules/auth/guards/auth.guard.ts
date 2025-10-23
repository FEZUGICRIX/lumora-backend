import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const userId = req.session?.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated.');
    }

    const user = await this.userService.findUserById(userId);

    req.user = user;

    return true;
  }
}
