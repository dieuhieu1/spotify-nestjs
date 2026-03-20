import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './token.service';
import { InvalidatedToken } from '../auth/entities/invalidated-token.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvalidatedToken, RefreshToken])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
