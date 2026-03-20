import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailRequest {
  @ApiProperty()
  @IsEmail()
  email: string;
}
