import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Playlist } from '../playlist/entities/playlist.entity';
import { UserRequest, UserUpdateRequest } from '../../dto/request/user.request.dto';
import { UserResponse } from '../../dto/response/user.response.dto';
import { PlaylistResponse } from '../../dto/response/playlist.response.dto';
import { PageResponse } from '../../dto/response/page-response.dto';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Playlist) private playlistRepo: Repository<Playlist>,
  ) {}

  toResponse(u: User): UserResponse {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      imageURL: u.imageURL,
      dob: u.dob,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      premiumStatus: u.premiumStatus,
      premiumExpiryDate: u.premiumExpiryDate,
      roles: (u.roles || []).map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        permissions: (r.permissions || []).map((p) => ({ id: p.id, name: p.name, description: p.description })),
      })),
      createdPlaylists: (u.createdPlaylists || []).map((p) => this.playlistToResponse(p)),
      savedPlaylistId: (u.savedPlaylists || []).map((p) => p.id),
    };
  }

  private playlistToResponse(p: Playlist): PlaylistResponse {
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      totalTracks: p.totalTracks,
      follower: p.follower,
      listener: p.listener,
      imageURL: p.imageURL,
      totalHours: p.totalHours,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      creator: null,
      songs: (p.songs || []).map((s) => ({ id: s.id, name: s.name, duration: s.duration, imageURL: s.imageURL })),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions', 'createdPlaylists', 'savedPlaylists'],
    });
  }

  async create(dto: UserRequest): Promise<UserResponse> {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new AppException(ErrorCode.EMAIL_EXISTED);

    const roles = dto.roles?.length ? await this.roleRepo.findBy({ id: In(dto.roles) }) : [];
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashedPassword, roles });
    const saved = await this.userRepo.save(user);
    return this.toResponse(await this.findById(saved.id));
  }

  async getUserById(id: number): Promise<UserResponse> {
    const u = await this.findById(id);
    if (!u) throw new AppException(ErrorCode.USER_NOT_EXISTED);
    return this.toResponse(u);
  }

  async findAll(page = 1, size = 10, sort = 'id'): Promise<PageResponse<UserResponse>> {
    const [items, total] = await this.userRepo.findAndCount({
      relations: ['roles', 'roles.permissions', 'createdPlaylists', 'savedPlaylists'],
      order: { [sort]: 'ASC' },
      skip: (page - 1) * size,
      take: size,
    });
    return {
      page, size,
      totalPages: Math.ceil(total / size),
      totalItems: total,
      items: items.map(this.toResponse.bind(this)),
    };
  }

  async update(id: number, dto: UserUpdateRequest): Promise<UserResponse> {
    const u = await this.findById(id);
    if (!u) throw new AppException(ErrorCode.USER_NOT_EXISTED);
    if (dto.roles) {
      u.roles = await this.roleRepo.findBy({ id: In(dto.roles) });
    }
    if (dto.name !== undefined) u.name = dto.name;
    if (dto.dob !== undefined) u.dob = dto.dob;
    await this.userRepo.save(u);
    return this.toResponse(await this.findById(id));
  }

  async delete(id: number): Promise<void> {
    const u = await this.findById(id);
    if (!u) throw new AppException(ErrorCode.USER_NOT_EXISTED);
    await this.userRepo.remove(u);
  }

  async savePlaylist(userId: number, playlistId: number): Promise<PlaylistResponse> {
    const u = await this.findById(userId);
    if (!u) throw new AppException(ErrorCode.USER_NOT_EXISTED);
    const playlist = await this.playlistRepo.findOne({ where: { id: playlistId }, relations: ['songs', 'creator'] });
    if (!playlist) throw new AppException(ErrorCode.PLAYLIST_NOT_EXISTED);
    if (!u.savedPlaylists) u.savedPlaylists = [];
    u.savedPlaylists.push(playlist);
    await this.userRepo.save(u);
    await this.playlistRepo.increment({ id: playlistId }, 'listener', 1);
    playlist.listener = Number(playlist.listener) + 1;
    return this.playlistToResponse(playlist);
  }

  async getSavedPlaylists(userId: number, page = 1, size = 10): Promise<PageResponse<PlaylistResponse>> {
    const u = await this.findById(userId);
    if (!u) throw new AppException(ErrorCode.USER_NOT_EXISTED);
    const saved = u.savedPlaylists || [];
    const start = (page - 1) * size;
    const items = saved.slice(start, start + size);
    return {
      page, size,
      totalPages: Math.ceil(saved.length / size),
      totalItems: saved.length,
      items: items.map(this.playlistToResponse.bind(this)),
    };
  }

  async removeSavedPlaylist(userId: number, playlistId: number): Promise<void> {
    const u = await this.findById(userId);
    if (!u) throw new AppException(ErrorCode.USER_NOT_EXISTED);
    u.savedPlaylists = (u.savedPlaylists || []).filter((p) => p.id !== playlistId);
    await this.userRepo.save(u);
  }

  async count(): Promise<number> {
    return this.userRepo.count();
  }
}
