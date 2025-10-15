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
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private usersService: UserService,
    private hash: HashService,
    // private jwt: JwtService,
  ) {}

  // TODO: с помощью AI отредактировать код
  async register(dto: RegisterInput, req: Request) {
    // Check user's unique data
    await this.usersService.checkUser({
      username: dto.username,
      email: dto.email,
    });

    if (dto.password !== dto.passwordRepeat) {
      throw new ConflictException('Passwords do not match');
    }

    const newUser = await this.usersService.createUser({
      username: dto.username,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password,
      email: dto.email,
      emailVerified: false,
      method: AuthMethod.CREDENTIALS,
      role: UserRole.USER,
    });

    if (!newUser) {
      throw new Error('User creation failed');
    }
    return newUser;
    // return this.saveSession(req, newUser);
  }

  async login() {}

  async logout() {}

  private async saveSession(req: Request, user: User) {
    return new Promise<{ user: User }>((resolve, reject) => {
      try {
        req.session.userId = user.id;
        req.session.role = user.role;

        req.session.save((err) => {
          if (err) return reject(err); // ❌ нельзя просто new InternalServerErrorException, надо reject
          resolve({ user });
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
