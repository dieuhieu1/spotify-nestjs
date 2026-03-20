import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { RoleService } from '../role/role.service';
import { VerificationCode } from './entities/verification-code.entity';
import { ForgotPasswordToken } from './entities/forgot-password-token.entity';
import { User } from '../user/entities/user.entity';
import { AuthRequest } from '../../dto/request/auth.request.dto';
import { RegisterRequest } from '../../dto/request/register.request.dto';
import { RefreshRequest } from '../../dto/request/refresh.request.dto';
import { ChangePasswordRequest } from '../../dto/request/change-password.request.dto';
import { EmailRequest } from '../../dto/request/email.request.dto';
import { VerifyCodeRequest } from '../../dto/request/verify-code.request.dto';
import { ResetPasswordRequest } from '../../dto/request/reset-password.request.dto';
import { TokenResponse } from '../../dto/response/token.response.dto';
import { StatsResponse } from '../../dto/response/stats.response.dto';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { RoleEnum } from '../../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private mailService: MailService,
    private roleService: RoleService,
    @InjectRepository(VerificationCode) private verificationCodeRepo: Repository<VerificationCode>,
    @InjectRepository(ForgotPasswordToken) private forgotPasswordTokenRepo: Repository<ForgotPasswordToken>,
  ) {}

  private async buildTokenResponse(user: User, refreshToken?: string): Promise<TokenResponse> {
    const accessToken = this.tokenService.generateAccessToken(user);
    const newRefreshToken = refreshToken ?? this.tokenService.generateRefreshToken(user);
    const refreshExpiry = new Date();
    const days = 20;
    refreshExpiry.setDate(refreshExpiry.getDate() + days);
    if (!refreshToken) {
      await this.tokenService.saveRefreshToken(newRefreshToken, refreshExpiry);
    }
    return { accessToken, refreshToken: newRefreshToken, authenticated: true, email: user.email };
  }

  async login(dto: AuthRequest): Promise<TokenResponse> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new AppException(ErrorCode.UNAUTHENTICATED);
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new AppException(ErrorCode.UNAUTHENTICATED);
    return this.buildTokenResponse(user);
  }

  async register(dto: RegisterRequest): Promise<TokenResponse> {
    if (dto.password !== dto.confirmPassword) throw new AppException(ErrorCode.PASSWORD_MISMATCH);
    const exists = await this.userService.findByEmail(dto.email);
    if (exists) throw new AppException(ErrorCode.EMAIL_EXISTED);

    const userRole = await this.roleService.findByName(RoleEnum.USER);
    if (!userRole) throw new AppException(ErrorCode.ROLE_NOT_EXISTED);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userEntity = await (this.userService as any).userRepo.save(
      (this.userService as any).userRepo.create({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        roles: [userRole],
      }),
    );

    const user = await this.userService.findByEmail(dto.email);
    const tokens = await this.buildTokenResponse(user);

    this.mailService.sendWelcomeEmail(dto.name, dto.email).catch(() => {});

    return tokens;
  }

  async refreshToken(dto: RefreshRequest): Promise<TokenResponse> {
    const payload = this.tokenService.verifyRefreshToken(dto.refreshToken);
    const stored = await this.tokenService.findRefreshToken(dto.refreshToken);
    if (!stored || stored.expiryDate < new Date()) throw new AppException(ErrorCode.INVALID_REFRESH_TOKEN);

    const user = await this.userService.findByEmail(payload.sub);
    if (!user) throw new AppException(ErrorCode.USER_NOT_EXISTED);

    const accessToken = this.tokenService.generateAccessToken(user);
    return { accessToken, refreshToken: dto.refreshToken, authenticated: true, email: user.email };
  }

  async logout(accessToken: string): Promise<void> {
    const payload = this.tokenService.verifyAccessToken(accessToken);
    await this.tokenService.invalidateToken(payload.jti, new Date(payload.exp * 1000));
  }

  async getMyInfo(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new AppException(ErrorCode.USER_NOT_EXISTED);
    const fullUser = await this.userService.findById(user.id);
    return this.userService.toResponse(fullUser);
  }

  async changePassword(email: string, dto: ChangePasswordRequest) {
    if (dto.newPassword !== dto.confirmPassword) throw new AppException(ErrorCode.PASSWORD_MISMATCH);
    const user = await this.userService.findByEmail(email);
    if (!user) throw new AppException(ErrorCode.USER_NOT_EXISTED);
    const match = await bcrypt.compare(dto.oldPassword, user.password);
    if (!match) throw new AppException(ErrorCode.INVALID_OLD_PASSWORD);
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await (this.userService as any).userRepo.save(user);
  }

  async forgotPassword(dto: EmailRequest): Promise<VerificationCode> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new AppException(ErrorCode.USER_NOT_EXISTED);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Math.floor(Date.now() / 60000) + 10;

    const vc = await this.verificationCodeRepo.save(
      this.verificationCodeRepo.create({ email: dto.email, verificationCode: code, expirationTime }),
    );

    this.mailService.sendVerificationCodeEmail(dto.email, code).catch(() => {});
    return vc;
  }

  async verifyCode(dto: VerifyCodeRequest): Promise<ForgotPasswordToken> {
    const vc = await this.verificationCodeRepo.findOne({
      where: { email: dto.email, verificationCode: dto.verificationCode },
    });
    if (!vc) throw new AppException(ErrorCode.VERIFICATION_CODE_INVALID);
    const now = Math.floor(Date.now() / 60000);
    if (vc.expirationTime < now) throw new AppException(ErrorCode.VERIFICATION_CODE_INVALID);

    const user = await this.userService.findByEmail(dto.email);
    const resetToken = this.tokenService.generateResetToken(user);
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);

    return this.forgotPasswordTokenRepo.save(
      this.forgotPasswordTokenRepo.create({ email: dto.email, forgotPasswordToken: resetToken, expiryTime }),
    );
  }

  async resetPassword(dto: ResetPasswordRequest): Promise<void> {
    if (dto.newPassword !== dto.confirmPassword) throw new AppException(ErrorCode.PASSWORD_MISMATCH);

    const fpt = await this.forgotPasswordTokenRepo.findOne({ where: { forgotPasswordToken: dto.forgotPasswordToken } });
    if (!fpt) throw new AppException(ErrorCode.FORGOT_PASSWORD_TOKEN_NOT_FOUND);

    this.tokenService.verifyResetToken(dto.forgotPasswordToken);

    const user = await this.userService.findByEmail(fpt.email);
    if (!user) throw new AppException(ErrorCode.USER_NOT_EXISTED);

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await (this.userService as any).userRepo.save(user);
    await this.forgotPasswordTokenRepo.remove(fpt);
    await this.verificationCodeRepo.delete({ email: fpt.email });
  }

  async getStats(): Promise<StatsResponse> {
    const manager = (this.userService as any).userRepo.manager;
    const [totalUsers, totalAlbums, totalArtists, totalSongs, totalPlaylists] = await Promise.all([
      manager.count(require('../user/entities/user.entity').User),
      manager.count(require('../album/entities/album.entity').Album),
      manager.count(require('../artist/entities/artist.entity').Artist),
      manager.count(require('../song/entities/song.entity').Song),
      manager.count(require('../playlist/entities/playlist.entity').Playlist),
    ]);
    return { totalUsers, totalAlbums, totalArtists, totalSongs, totalPlaylists };
  }

  async cleanupExpiredVerificationCodes(): Promise<void> {
    const now = Math.floor(Date.now() / 60000);
    await this.verificationCodeRepo.delete({ expirationTime: LessThan(now) });
  }
}
