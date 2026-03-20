import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { VerificationCode } from './entities/verification-code.entity';
import { ForgotPasswordToken } from './entities/forgot-password-token.entity';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { RoleModule } from '../role/role.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationCode, ForgotPasswordToken]),
    PassportModule,
    UserModule,
    TokenModule,
    RoleModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
