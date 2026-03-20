import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AlbumRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  imageURL: string;

  @ApiProperty({ type: [Number] })
  @ArrayNotEmpty()
  artistIds: number[];

  @ApiProperty({ type: [Number] })
  @ArrayNotEmpty()
  songIds: number[];
}
