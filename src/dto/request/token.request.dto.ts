import { ApiProperty } from '@nestjs/swagger';

export class TokenRequest {
  @ApiProperty()
  accessToken: string;
}
