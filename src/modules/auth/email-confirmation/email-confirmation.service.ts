import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Token, TokenType, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { ConfirmationInput } from './dto/email-confirmation.input';

import { PrismaService } from '@/modules/prisma/prisma.service';
import { MailService } from '@/modules/mail/mail.service';
import { UserService } from '@/modules/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  async newVerification(
    req: Request,
    dto: ConfirmationInput,
  ): Promise<boolean> {
    const existingToken = await this.prisma.token.findUnique({
      where: {
        token: dto.token,
        type: TokenType.VERIFICATION,
      },
    });
    if (!existingToken) {
      throw new NotFoundException(
        'Токен Подтверждения не найден. Пожалуйста, убедитесь, что у вас правильный токен',
      );
    }

    const isExpired = new Date() > new Date(existingToken.expiresAt);
    if (isExpired)
      throw new BadRequestException(
        'Токен подтверждения истек. Пожалуйста, запросите новый токен для подтверждения',
      );

    const existingUser = await this.userService.findUserByEmail(
      existingToken.email,
    );
    if (!existingUser)
      throw new NotFoundException(
        'Пользователь с указанным адресом электронной почты не найден. Пожалуйста, убедитесь, что вы ввели правильный email',
      );

    await this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        emailVerified: true,
      },
    });

    await this.prisma.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.VERIFICATION,
      },
    });

    await this.authService.saveSession(req, existingUser);

    return true;
  }

  async sendVerificationToken(user: User): Promise<boolean> {
    const { email, token } = await this.generateVerificationToken(user.email);

    await this.mailService.sendConfirmationEmail(email, token);

    return true;
  }

  private async generateVerificationToken(email: string): Promise<Token> {
    const token = uuidv4();
    const expiresAt = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

    const existingToken = await this.prisma.token.findFirst({
      where: {
        email,
        type: TokenType.VERIFICATION,
      },
    });

    if (existingToken) {
      await this.prisma.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.VERIFICATION,
        },
      });
    }

    const verificationToken = await this.prisma.token.create({
      data: {
        email,
        token,
        expiresAt,
        type: TokenType.VERIFICATION,
      },
    });

    return verificationToken;
  }
}
