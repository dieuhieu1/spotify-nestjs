import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../../token/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SIGNER_KEY'),
      algorithms: ['HS512'],
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const jti = payload.jti;
    if (jti && (await this.tokenService.isTokenInvalidated(jti))) {
      throw new UnauthorizedException('Token has been invalidated');
    }
    return {
      email: payload.sub,
      name: payload.iss,
      scope: payload.scope,
      jti: payload.jti,
      exp: payload.exp,
    };
  }
}
