import { IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserRequest {
  @ApiPropertyOptional()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password: string;

  @ApiPropertyOptional()
  dob: Date;

  @ApiPropertyOptional()
  imageURL: string;

  @ApiPropertyOptional({ type: [Number] })
  roles: number[];

  @ApiPropertyOptional({ type: [Number] })
  createdPlaylists: number[];
}

export class UserUpdateRequest {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  dob: Date;

  @ApiPropertyOptional({ type: [Number] })
  roles: number[];

  @ApiPropertyOptional({ type: [Number] })
  createdPlaylists: number[];
}
