import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { Prisma, User, AuthMethod, UserRole } from '@prisma/client';
import type { AuthenticatedRequest } from '@/common/types';

import { UserService } from '@/modules/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from './services/hash.service';
import { ProviderService } from './provider/provider.service';

import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { BaseOAuthService } from './provider/services/base-oauth.service';
import { TypeUserInfo } from './provider/services/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
    private readonly usersService: UserService,
    private readonly hash: HashService,
    private readonly configService: ConfigService,
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
      passwordHash: await this.hash.hashPassword(dto.password),
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
    const user = await this.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.saveSession(req, user);
    return user;
  }

  async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string,
  ): Promise<User> {
    const providerInstance = this.getProviderInstance(provider);
    const profile = await this.getUserProfile(providerInstance, code);

    return await this.prisma.$transaction(async (tx) => {
      const existingUser = await this.findExistingUser(tx, profile);

      if (existingUser) {
        await this.saveSession(req, existingUser);
        return existingUser;
      }

      return await this.createNewUserWithAccount(tx, req, profile);
    });
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

  private getProviderInstance(provider: string) {
    const providerInstance = this.providerService.findByService(provider);
    if (!providerInstance) {
      throw new NotFoundException(`Provider ${provider} not found`);
    }
    return providerInstance;
  }

  private async getUserProfile(
    providerInstance: BaseOAuthService,
    code: string,
  ): Promise<TypeUserInfo> {
    const profile = await providerInstance.findUserByCode(code);
    if (!profile) {
      throw new BadRequestException('Failed to extract profile from code');
    }
    return profile;
  }

  private async createNewUserWithAccount(
    tx: Prisma.TransactionClient,
    req: Request,
    profile: TypeUserInfo,
  ) {
    const authMethod = this.validateAuthMethod(profile.provider);

    const user = await this.usersService.createUser({
      email: profile.email,
      method: authMethod,
      firstName: profile.name,
      passwordHash: '', // ← в createUser превратится в null
      avatar: profile.picture,
      emailVerified: true,
    });

    await this.createAccount(tx, user.id, profile);
    await this.saveSession(req, user);

    return user;
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findUserForAuth(email);

    if (!user) return null;

    // ✅ Защита от OAuth логина по паролю
    if (user.method !== AuthMethod.CREDENTIALS) return null;

    if (!password || !user.passwordHash) return null;

    const isPasswordValid = await this.hash.verifyPassword(
      user.passwordHash,
      password,
    );

    return isPasswordValid ? user : null;
  }

  private validateAuthMethod(provider: string): AuthMethod {
    const authMethod = AuthMethod[provider.toUpperCase()];
    if (!authMethod) {
      throw new BadRequestException(`Unsupported provider: ${provider}`);
    }
    return authMethod;
  }

  private async createAccount(
    tx: Prisma.TransactionClient,
    userId: string,
    profile: TypeUserInfo,
  ) {
    await tx.account.create({
      data: {
        userId,
        type: 'oauth',
        provider: profile.provider,
        access_token: profile.access_token,
        refresh_token: profile.refresh_token,
        expires_at: profile.expires_at,
      },
    });
  }

  private async findExistingUser(
    tx: Prisma.TransactionClient,
    profile: TypeUserInfo,
  ): Promise<User | null> {
    const account = await tx.account.findFirst({
      where: {
        id: profile.id,
        provider: profile.provider,
      },
    });

    if (!account?.userId) {
      return null;
    }

    return await this.usersService.findUserById(account.userId);
  }

  private async saveSession(
    req: AuthenticatedRequest,
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
