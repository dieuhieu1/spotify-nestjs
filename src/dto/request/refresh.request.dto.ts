import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshRequest {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
