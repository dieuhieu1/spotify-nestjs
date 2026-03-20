import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../dto/request/auth.request.dto';
import { RegisterRequest } from '../../dto/request/register.request.dto';
import { RefreshRequest } from '../../dto/request/refresh.request.dto';
import { TokenRequest } from '../../dto/request/token.request.dto';
import { ChangePasswordRequest } from '../../dto/request/change-password.request.dto';
import { EmailRequest } from '../../dto/request/email.request.dto';
import { VerifyCodeRequest } from '../../dto/request/verify-code.request.dto';
import { ResetPasswordRequest } from '../../dto/request/reset-password.request.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login' })
  login(@Body() dto: AuthRequest) {
    return this.authService.login(dto);
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register' })
  register(@Body() dto: RegisterRequest) {
    return this.authService.register(dto);
  }

  @Post('refresh-token')
  @Public()
  @ApiOperation({ summary: 'Refresh token' })
  refreshToken(@Body() dto: RefreshRequest) {
    return this.authService.refreshToken(dto);
  }

  @Post('logout')
  @Public()
  @ApiOperation({ summary: 'Logout' })
  logout(@Body() dto: TokenRequest) {
    return this.authService.logout(dto.accessToken);
  }

  @Get('myInfo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my info' })
  getMyInfo(@CurrentUser() user: any) {
    return this.authService.getMyInfo(user.email);
  }

  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordRequest) {
    return this.authService.changePassword(user.email, dto);
  }

  @Post('forgot-password')
  @Public()
  @ApiOperation({ summary: 'Forgot password - send verification code' })
  forgotPassword(@Body() dto: EmailRequest) {
    return this.authService.forgotPassword(dto);
  }

  @Post('forgot-password/verify-code')
  @Public()
  @ApiOperation({ summary: 'Verify code' })
  verifyCode(@Body() dto: VerifyCodeRequest) {
    return this.authService.verifyCode(dto);
  }

  @Post('forgot-password/reset-password')
  @Public()
  @ApiOperation({ summary: 'Reset password' })
  resetPassword(@Body() dto: ResetPasswordRequest) {
    return this.authService.resetPassword(dto);
  }

  @Get('stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get stats' })
  getStats() {
    return this.authService.getStats();
  }
}
