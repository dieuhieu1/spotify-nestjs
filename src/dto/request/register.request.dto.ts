import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ minLength: 6 })
  @MinLength(6)
  password: string;

  @ApiProperty({ minLength: 6 })
  confirmPassword: string;
}
