// TODO: убрать комментарий ниже
// бизнес-логика: register / login / refresh / logout / revoke / resetPassword / verifyEmail.

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from './services/hash.service';
import { JwtService } from './services/jwt.service';
import { v4 as uuid } from 'uuid';
import { RegisterInput } from './dto/register.input';
import { AuthMethod, UserRole } from '@prisma/client';
import type { Request } from 'express';
import { User } from '@prisma/client';
import { Session } from 'express-session';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private usersService: UserService,
    private hash: HashService,
    // private jwt: JwtService,
  ) {}

  async register(dto: RegisterInput, req: Request): Promise<User> {
    await this.usersService.checkUser(dto.username, dto.email);

    if (dto.password !== dto.passwordRepeat) {
      throw new ConflictException('Passwords do not match');
    }

    const newUser: User = await this.usersService.createUser({
      username: dto.username,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password,
      email: dto.email,
      emailVerified: false,
      method: AuthMethod.CREDENTIALS,
      role: UserRole.USER,
    });

    // Create session
    await this.saveSession(req, newUser);

    return newUser;
  }

  async login() {}

  async logout() {}

  private async saveSession(
    req: Request & { session: Session & { userId?: string; role?: string } },
    user: User,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        req.session.userId = user.id;
        req.session.role = user.role;

        req.session.save((err) => {
          if (err) {
            console.error('Failed to save session for user', user.id, err);
            return reject(
              new InternalServerErrorException('Session save failed'),
            );
          }
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
