import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TokenService } from '../token/token.service';
import { AuthService } from '../auth/auth.service';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class ScheduleTasksService {
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private paymentService: PaymentService,
  ) {}

  @Cron('0 0 * * *')
  async cleanupExpiredRefreshTokens() {
    await this.tokenService.cleanupExpiredRefreshTokens();
  }

  @Cron('0 * * * *')
  async checkPremiumExpiry() {
    await this.paymentService.checkAndExpirePremium();
  }

  @Cron('0 * * * *')
  async cleanupVerificationCodes() {
    await this.authService.cleanupExpiredVerificationCodes();
  }
}
