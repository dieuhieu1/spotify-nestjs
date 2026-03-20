import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Request } from 'express';

@ApiTags('Payment')
@Controller('v1/payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('vn-pay')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create VNPay payment URL' })
  @ApiQuery({ name: 'premiumType', enum: ['1-month', '3-month', '6-month', '12-month'] })
  createPayment(
    @CurrentUser() user: any,
    @Query('premiumType') premiumType: string,
  ) {
    return this.paymentService.createPayment(user.email, premiumType);
  }

  @Post('vn-pay-callback')
  @Public()
  @ApiOperation({ summary: 'VNPay callback' })
  handleCallback(@Req() req: Request) {
    return this.paymentService.handleCallback(req.query as Record<string, string>);
  }

  @Get('premium-status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check premium status' })
  checkPremiumStatus(@CurrentUser() user: any) {
    return this.paymentService.checkPremiumStatus(user.email);
  }
}
