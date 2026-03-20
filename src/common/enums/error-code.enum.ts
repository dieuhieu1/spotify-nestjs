import { HttpStatus } from '@nestjs/common';

export interface ErrorCodeDef {
  status: HttpStatus;
  message: string;
}

export const ErrorCode: Record<string, ErrorCodeDef> = {
  UNAUTHENTICATED: { status: HttpStatus.UNAUTHORIZED, message: 'Unauthenticated' },
  UNAUTHORIZED: { status: HttpStatus.FORBIDDEN, message: 'Unauthorized' },
  USER_EXISTED: { status: HttpStatus.BAD_REQUEST, message: 'User already existed' },
  USER_NOT_EXISTED: { status: HttpStatus.NOT_FOUND, message: 'User not found' },
  EMAIL_EXISTED: { status: HttpStatus.BAD_REQUEST, message: 'Email already existed' },
  SONG_EXISTED: { status: HttpStatus.BAD_REQUEST, message: 'Song already existed' },
  SONG_NOT_EXISTED: { status: HttpStatus.NOT_FOUND, message: 'Song not found' },
  PLAYLIST_EXISTED: { status: HttpStatus.BAD_REQUEST, message: 'Playlist already existed' },
  PLAYLIST_NOT_EXISTED: { status: HttpStatus.NOT_FOUND, message: 'Playlist not found' },
  ALBUM_EXISTED: { status: HttpStatus.BAD_REQUEST, message: 'Album already existed' },
  ALBUM_NOT_EXISTED: { status: HttpStatus.NOT_FOUND, message: 'Album not found' },
  ARTIST_EXISTED: { status: HttpStatus.BAD_REQUEST, message: 'Artist already existed' },
  ARTIST_NOT_EXISTED: { status: HttpStatus.NOT_FOUND, message: 'Artist not found' },
  GENRE_EXISTED: { status: HttpStatus.BAD_REQUEST, message: 'Genre already existed' },
  GENRE_NOT_EXISTED: { status: HttpStatus.NOT_FOUND, message: 'Genre not found' },
  ROLE_NOT_EXISTED: { status: HttpStatus.NOT_FOUND, message: 'Role not found' },
  PERMISSION_NOT_EXISTED: { status: HttpStatus.NOT_FOUND, message: 'Permission not found' },
  PASSWORD_MISMATCH: { status: HttpStatus.BAD_REQUEST, message: 'Passwords do not match' },
  INVALID_OLD_PASSWORD: { status: HttpStatus.BAD_REQUEST, message: 'Old password is incorrect' },
  INVALID_REFRESH_TOKEN: { status: HttpStatus.BAD_REQUEST, message: 'Invalid refresh token' },
  TOKEN_TYPE_INVALID: { status: HttpStatus.BAD_REQUEST, message: 'Invalid token type' },
  FORGOT_PASSWORD_TOKEN_NOT_FOUND: { status: HttpStatus.NOT_FOUND, message: 'Reset password token not found' },
  INVALID_PREMIUM_TYPE: { status: HttpStatus.BAD_REQUEST, message: 'Invalid premium type' },
  EMAIL_SEND_FAILED: { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to send email' },
  FILE_EMPTY: { status: HttpStatus.BAD_REQUEST, message: 'File is empty' },
  FILE_TOO_LARGE: { status: HttpStatus.BAD_REQUEST, message: 'File size exceeds limit' },
  FILE_TYPE_INVALID: { status: HttpStatus.BAD_REQUEST, message: 'Unsupported file type' },
  VERIFICATION_CODE_INVALID: { status: HttpStatus.BAD_REQUEST, message: 'Invalid or expired verification code' },
};
