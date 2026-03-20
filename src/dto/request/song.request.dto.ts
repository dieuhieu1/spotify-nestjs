import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SongRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  imageURL: string;

  @ApiPropertyOptional()
  fileSongURL: string;

  @ApiPropertyOptional()
  duration: number;

  @ApiPropertyOptional({ default: 0 })
  listener: number;

  @ApiProperty({ type: [Number] })
  @ArrayNotEmpty()
  artistIds: number[];

  @ApiPropertyOptional()
  genreId: number;
}
