import { registerEnumType } from '@nestjs/graphql';
import { UserRole, AuthMethod } from '@prisma/client';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Defines roles available in the system',
});

registerEnumType(AuthMethod, {
  name: 'AuthMethod',
  description: 'Supported authentication methods',
});
