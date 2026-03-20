import { Module } from '@nestjs/common';
import { ScheduleTasksService } from './schedule.service';
import { TokenModule } from '../token/token.module';
import { AuthModule } from '../auth/auth.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [TokenModule, AuthModule, PaymentModule],
  providers: [ScheduleTasksService],
})
export class ScheduleTasksModule {}
