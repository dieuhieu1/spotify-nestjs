import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';

import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SongModule } from './modules/song/song.module';
import { AlbumModule } from './modules/album/album.module';
import { ArtistModule } from './modules/artist/artist.module';
import { GenreModule } from './modules/genre/genre.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { PaymentModule } from './modules/payment/payment.module';
import { FileModule } from './modules/file/file.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { MailModule } from './modules/mail/mail.module';
import { SearchModule } from './modules/search/search.module';
import { TokenModule } from './modules/token/token.module';
import { ScheduleTasksModule } from './modules/schedule/schedule.module';

// Entities
import { User } from './modules/user/entities/user.entity';
import { Role } from './modules/role/entities/role.entity';
import { Permission } from './modules/permission/entities/permission.entity';
import { Song } from './modules/song/entities/song.entity';
import { Album } from './modules/album/entities/album.entity';
import { Artist } from './modules/artist/entities/artist.entity';
import { Genre } from './modules/genre/entities/genre.entity';
import { Playlist } from './modules/playlist/entities/playlist.entity';
import { FileEntity } from './modules/file/entities/file.entity';
import { RefreshToken } from './modules/auth/entities/refresh-token.entity';
import { InvalidatedToken } from './modules/auth/entities/invalidated-token.entity';
import { ForgotPasswordToken } from './modules/auth/entities/forgot-password-token.entity';
import { VerificationCode } from './modules/auth/entities/verification-code.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USER', 'root'),
        password: config.get('DB_PASS', ''),
        database: config.get('DB_NAME', 'mymusic'),
        entities: [
          User, Role, Permission, Song, Album, Artist, Genre,
          Playlist, FileEntity, RefreshToken, InvalidatedToken,
          ForgotPasswordToken, VerificationCode,
        ],
        synchronize: true,
        charset: 'utf8mb4',
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST', 'smtp.gmail.com'),
          port: config.get<number>('MAIL_PORT', 587),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"MyMusic" <${config.get('MAIL_USER')}>`,
        },
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    SongModule,
    AlbumModule,
    ArtistModule,
    GenreModule,
    PlaylistModule,
    PaymentModule,
    FileModule,
    RoleModule,
    PermissionModule,
    MailModule,
    SearchModule,
    TokenModule,
    ScheduleTasksModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
