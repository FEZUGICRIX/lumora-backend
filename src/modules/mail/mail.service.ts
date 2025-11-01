import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { Resend } from 'resend';

import { ConfirmationTemplate } from './templates/confirmation.template';
import { ResetPasswordTemplate } from './templates/reset-password.template';

@Injectable()
export class MailService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(
      this.configService.getOrThrow<string>('RESEND_API_KEY'),
    );
  }

  async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const template = await render(ConfirmationTemplate({ domain, token }));

    return this.sendMail(email, 'Подтверждение почты', template);
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const template = await render(ResetPasswordTemplate({ domain, token }));

    return this.sendMail(email, 'Сброс пароля ', template);
  }

  private async sendMail(emailTo: string, subject: string, html: string) {
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
