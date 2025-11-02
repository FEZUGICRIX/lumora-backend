import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { Resend, type CreateEmailResponse } from 'resend';

import {
  ConfirmationTemplate,
  ResetPasswordTemplate,
  TwoFactorAuthTemplate,
} from './templates';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly domain: string;

  constructor(private readonly configService: ConfigService) {
    this.domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    this.resend = new Resend(
      this.configService.getOrThrow<string>('RESEND_API_KEY'),
    );
  }

  async sendConfirmationEmail(
    email: string,
    token: string,
  ): Promise<CreateEmailResponse> {
    const template = await render(
      ConfirmationTemplate({ domain: this.domain, token }),
    );

    return this.sendMail(email, 'Подтверждение почты', template);
  }

  async sendResetPasswordEmail(
    email: string,
    token: string,
  ): Promise<CreateEmailResponse> {
    const template = await render(
      ResetPasswordTemplate({ domain: this.domain, token }),
    );

    return this.sendMail(email, 'Сброс пароля', template);
  }

  async sendTwoFactorTokenEmail(
    email: string,
    token: string,
  ): Promise<CreateEmailResponse> {
    const template = await render(
      TwoFactorAuthTemplate({ domain: this.domain, token }),
    );

    return this.sendMail(email, 'Подтверждение вашей личности', template);
  }

  private async sendMail(
    emailTo: string,
    subject: string,
    html: string,
  ): Promise<CreateEmailResponse> {
    const from = this.configService.getOrThrow<string>('MAIL_FROM');

    try {
      const result = await this.resend.emails.send({
        from: from,
        to: emailTo,
        subject,
        html,
      });

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
