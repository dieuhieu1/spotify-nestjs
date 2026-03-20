import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArtistRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  imageURL: string;
}
