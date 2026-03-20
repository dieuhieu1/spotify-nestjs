import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PermissionRequest {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description: string;
}
