import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(name: string, email: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to MyMusic!',
        html: `
          <h1>Welcome to MyMusic, ${name}!</h1>
          <p>Your account has been created successfully with email: <strong>${email}</strong></p>
          <p>Enjoy your music experience!</p>
        `,
      });
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}`, error);
    }
  }

  async sendVerificationCodeEmail(email: string, code: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'MyMusic - Password Reset Verification Code',
        html: `
          <h1>Password Reset Request</h1>
          <p>Your verification code is: <strong style="font-size: 24px;">${code}</strong></p>
          <p>This code expires in <strong>10 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
        `,
      });
    } catch (error) {
      this.logger.error(`Failed to send verification code to ${email}`, error);
    }
  }

  async sendPaymentConfirmationEmail(
    email: string,
    name: string,
    plan: string,
    expiryDate: Date,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'MyMusic Premium - Payment Confirmation',
        html: `
          <h1>Payment Confirmed!</h1>
          <p>Hello ${name},</p>
          <p>Your <strong>MyMusic Premium (${plan})</strong> plan has been activated.</p>
          <p>Expiry date: <strong>${expiryDate.toISOString().split('T')[0]}</strong></p>
          <p>Enjoy unlimited music!</p>
        `,
      });
    } catch (error) {
      this.logger.error(`Failed to send payment confirmation to ${email}`, error);
    }
  }
}
