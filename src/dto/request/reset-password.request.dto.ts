import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequest {
  @ApiProperty()
  @IsNotEmpty()
  forgotPasswordToken: string;

  @ApiProperty({ minLength: 6 })
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ minLength: 6 })
  confirmPassword: string;
}
