import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/entities/user.entity';
import { InvalidatedToken } from '../auth/entities/invalidated-token.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(InvalidatedToken)
    private invalidatedTokenRepo: Repository<InvalidatedToken>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  buildScope(user: User): string {
    const scopes: string[] = [];
    if (user.roles) {
      for (const role of user.roles) {
        scopes.push(`ROLE_${role.name}`);
        if (role.permissions) {
          for (const perm of role.permissions) {
            scopes.push(perm.name);
          }
        }
      }
    }
    return scopes.join(' ');
  }

  generateAccessToken(user: User): string {
    const expiryMinutes = this.configService.get<number>('JWT_ACCESS_EXPIRY_MINUTES', 15);
    const key = this.configService.get<string>('JWT_SIGNER_KEY');
    return jwt.sign(
      {
        sub: user.email,
        iss: user.name,
        scope: this.buildScope(user),
        jti: uuidv4(),
      },
      key,
      { algorithm: 'HS512', expiresIn: `${expiryMinutes}m` },
    );
  }

  generateRefreshToken(user: User): string {
    const expiryDays = this.configService.get<number>('JWT_REFRESH_EXPIRY_DAYS', 20);
    const key = this.configService.get<string>('JWT_REFRESH_KEY');
    return jwt.sign(
      {
        sub: user.email,
        iss: user.name,
        scope: this.buildScope(user),
        jti: uuidv4(),
      },
      key,
      { algorithm: 'HS512', expiresIn: `${expiryDays}d` },
    );
  }

  generateResetToken(user: User): string {
    const expiryMinutes = this.configService.get<number>('JWT_RESET_EXPIRY_MINUTES', 15);
    const key = this.configService.get<string>('JWT_RESET_KEY');
    return jwt.sign(
      {
        sub: user.email,
        iss: user.name,
        scope: this.buildScope(user),
        jti: uuidv4(),
      },
      key,
      { algorithm: 'HS512', expiresIn: `${expiryMinutes}m` },
    );
  }

  verifyAccessToken(token: string): any {
    const key = this.configService.get<string>('JWT_SIGNER_KEY');
    try {
      return jwt.verify(token, key, { algorithms: ['HS512'] });
    } catch {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }
  }

  verifyRefreshToken(token: string): any {
    const key = this.configService.get<string>('JWT_REFRESH_KEY');
    try {
      return jwt.verify(token, key, { algorithms: ['HS512'] });
    } catch {
      throw new AppException(ErrorCode.INVALID_REFRESH_TOKEN);
    }
  }

  verifyResetToken(token: string): any {
    const key = this.configService.get<string>('JWT_RESET_KEY');
    try {
      return jwt.verify(token, key, { algorithms: ['HS512'] });
    } catch {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }
  }

  async isTokenInvalidated(jti: string): Promise<boolean> {
    const found = await this.invalidatedTokenRepo.findOne({ where: { id: jti } });
    return !!found;
  }

  async invalidateToken(jti: string, expiryTime: Date): Promise<void> {
    await this.invalidatedTokenRepo.save({ id: jti, expiryTime });
  }

  async saveRefreshToken(token: string, expiryDate: Date): Promise<void> {
    await this.refreshTokenRepo.save({ refreshToken: token, expiryDate });
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepo.findOne({ where: { refreshToken: token } });
  }

  async cleanupExpiredRefreshTokens(): Promise<void> {
    await this.refreshTokenRepo.delete({ expiryDate: LessThan(new Date()) });
  }
}
