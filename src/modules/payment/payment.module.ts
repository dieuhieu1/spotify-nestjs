import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [UserModule, RoleModule, MailModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
