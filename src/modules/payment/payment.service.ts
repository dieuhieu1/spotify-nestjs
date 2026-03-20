import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { MailService } from '../mail/mail.service';
import { VNPayResponse } from '../../dto/response/vnpay.response.dto';
import { PremiumResponse } from '../../dto/response/premium.response.dto';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

const PREMIUM_AMOUNTS: Record<string, number> = {
  '1-month': 30000,
  '3-month': 79000,
  '6-month': 169000,
  '12-month': 349000,
};

const PREMIUM_MONTHS: Record<string, number> = {
  '1-month': 1,
  '3-month': 3,
  '6-month': 6,
  '12-month': 12,
};

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private roleService: RoleService,
    private mailService: MailService,
  ) {}

  async createPayment(email: string, premiumType: string): Promise<VNPayResponse> {
    const amount = PREMIUM_AMOUNTS[premiumType];
    if (!amount) throw new AppException(ErrorCode.INVALID_PREMIUM_TYPE);

    const vnpUrl = this.configService.get('VNPAY_URL');
    const tmnCode = this.configService.get('VNPAY_TMN_CODE');
    const secretKey = this.configService.get('VNPAY_SECRET_KEY');
    const returnUrl = this.configService.get('VNPAY_RETURN_URL');

    const now = new Date();
    const createDate = now.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    const txnRef = `${Date.now()}_${email.replace('@', '_').replace('.', '_')}`;

    const params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `${email}:${premiumType}`,
      vnp_OrderType: 'other',
      vnp_Amount: String(amount * 100),
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    const sortedKeys = Object.keys(params).sort();
    const signData = sortedKeys.map((k) => `${k}=${params[k]}`).join('&');
    const hmac = crypto.createHmac('sha512', secretKey).update(signData).digest('hex');
    params['vnp_SecureHash'] = hmac;

    const query = Object.keys(params).map((k) => `${k}=${encodeURIComponent(params[k])}`).join('&');
    const paymentUrl = `${vnpUrl}?${query}`;

    return { code: 'ok', message: 'Success', paymentUrl };
  }

  async handleCallback(query: Record<string, string>): Promise<PremiumResponse> {
    const responseCode = query['vnp_ResponseCode'];
    if (responseCode !== '00') {
      return { isPremiumStatus: false, expirationDate: null };
    }

    const orderInfo = query['vnp_OrderInfo'] || '';
    const [email, premiumType] = orderInfo.split(':');

    const months = PREMIUM_MONTHS[premiumType] || 1;
    const user = await this.userService.findByEmail(email);
    if (!user) return { isPremiumStatus: false, expirationDate: null };

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);

    const premiumRole = await this.roleService.findByName('PREMIUM');
    if (premiumRole) {
      const userEntity = await this.userService.findById(user.id);
      userEntity.premiumStatus = true;
      userEntity.premiumExpiryDate = expiryDate;
      userEntity.roles = [premiumRole as any];
      await (this.userService as any).userRepo.save(userEntity);
    }

    this.mailService.sendPaymentConfirmationEmail(email, user.name, premiumType, expiryDate).catch(() => {});

    return { isPremiumStatus: true, expirationDate: expiryDate };
  }

  async checkPremiumStatus(email: string): Promise<PremiumResponse> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new AppException(ErrorCode.USER_NOT_EXISTED);
    return { isPremiumStatus: user.premiumStatus, expirationDate: user.premiumExpiryDate };
  }

  async checkAndExpirePremium(): Promise<void> {
    const manager = (this.userService as any).userRepo.manager;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredUsers = await (this.userService as any).userRepo.find({
      where: { premiumStatus: true },
      relations: ['roles'],
    });

    const userRole = await this.roleService.findByName('USER');
    for (const u of expiredUsers) {
      if (u.premiumExpiryDate && new Date(u.premiumExpiryDate) < today) {
        u.premiumStatus = false;
        if (userRole) u.roles = [userRole as any];
        await manager.save(u);
      }
    }
  }
}
