import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from './services/hash.service';
import { JwtService } from './services/jwt.service';
import { v4 as uuid } from 'uuid';
import { RegisterInput } from './dto/register.input';
import { AuthMethod, UserRole } from '@prisma/client';
import type { Request, Response } from 'express';
import { User } from '@prisma/client';
import { Session } from 'express-session';
import { LoginInput } from './dto/login.input';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UserService,
    private readonly hash: HashService,
    private readonly configService: ConfigService,
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

  async login(dto: LoginInput, req: Request): Promise<User> {
    const user = await this.usersService.findUserByEmail(dto.email);

    if (!user || !dto.password) {
      throw new NotFoundException('User not found. Please check your data.');
    }

    const isPasswordValid = await this.hash.verifyPassword(
      user.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid password. Please try again or reset password if you forgot it.',
      );
    }

    await this.saveSession(req, user);
    return user;
  }

  async logout(req: Request, res: Response): Promise<boolean> {
    try {
      await new Promise<void>((resolve, reject) => {
        req.session.destroy((error) => (error ? reject(error) : resolve()));
      });

      res.clearCookie(this.configService.get<string>('SESSION_NAME')!);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Logout failed');
    }
  }

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
