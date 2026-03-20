import { ArrayNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlaylistRequest {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  imageURL: string;

  @ApiPropertyOptional()
  follower: number;

  @ApiPropertyOptional()
  listener: number;

  @ApiProperty({ type: [Number] })
  @ArrayNotEmpty()
  songIds: number[];
}
