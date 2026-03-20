import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleRequest {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional({ type: [Number] })
  permissionIds: number[];
}
