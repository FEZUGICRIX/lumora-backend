import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ProviderService } from '../provider/provider.service';

@Injectable()
export class AuthProviderGuard implements CanActivate {
  constructor(private readonly providerService: ProviderService) {}

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const args = ctx.getArgs();

    const provider = args.provider;

    if (!provider) {
      throw new NotFoundException('Провайдер не указан');
    }

    const providerInstance = this.providerService.findByService(provider);

    if (!providerInstance) {
      throw new NotFoundException(
        `Провайдер ${provider} не найден. Пожалуйста, проверьте правильность введенных данных.`,
      );
    }

    return true;
  }
}
