// JwtService — обертка над @nestjs/jwt (RS256) — sign/verify access token.
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwt: NestJwtService) {}

  signAccess(payload: Record<string, any>) {
    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      algorithm: 'RS256' as const,
    });
  }

  verifyAccess(token: string): Promise<object> {
    return this.jwt.verifyAsync(token, { algorithms: ['RS256'] });
  }
}
