import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Playlist } from './entities/playlist.entity';
import { Song } from '../song/entities/song.entity';
import { PlaylistRequest } from '../../dto/request/playlist.request.dto';
import { PlaylistResponse } from '../../dto/response/playlist.response.dto';
import { PageResponse } from '../../dto/response/page-response.dto';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist) private playlistRepo: Repository<Playlist>,
    @InjectRepository(Song) private songRepo: Repository<Song>,
  ) {}

  toResponse(p: Playlist): PlaylistResponse {
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
      creator: p.creator ? { id: p.creator.id, name: p.creator.name, imageURL: p.creator.imageURL } : null,
      songs: (p.songs || []).map((s) => ({ id: s.id, name: s.name, duration: s.duration, imageURL: s.imageURL })),
    };
  }

  private calcStats(songs: Song[]) {
    return {
      totalTracks: songs.length,
      totalHours: songs.reduce((sum, s) => sum + (s.duration || 0), 0) / 3600,
    };
  }

  private async findWithRelations(id: number): Promise<Playlist> {
    const p = await this.playlistRepo.findOne({ where: { id }, relations: ['songs', 'creator'] });
    if (!p) throw new AppException(ErrorCode.PLAYLIST_NOT_EXISTED);
    return p;
  }

  async create(dto: PlaylistRequest, creatorId: number): Promise<PlaylistResponse> {
    const exists = await this.playlistRepo.findOne({ where: { title: dto.title } });
    if (exists) throw new AppException(ErrorCode.PLAYLIST_EXISTED);

    const songs = dto.songIds?.length ? await this.songRepo.findBy({ id: In(dto.songIds) }) : [];
    const stats = this.calcStats(songs);

    const creator = { id: creatorId } as any;
    const playlist = this.playlistRepo.create({
      title: dto.title,
      description: dto.description,
      imageURL: dto.imageURL,
      songs,
      creator,
      ...stats,
    });
    const saved = await this.playlistRepo.save(playlist);
    return this.toResponse(await this.findWithRelations(saved.id));
  }

  async findById(id: number): Promise<PlaylistResponse> {
    const p = await this.findWithRelations(id);
    await this.playlistRepo.increment({ id }, 'follower', 1);
    await this.playlistRepo.increment({ id }, 'listener', 1);
    p.follower = Number(p.follower) + 1;
    p.listener = Number(p.listener) + 1;
    return this.toResponse(p);
  }

  async findAll(page = 1, size = 10, sort = 'id'): Promise<PageResponse<PlaylistResponse>> {
    const [items, total] = await this.playlistRepo.findAndCount({
      relations: ['songs', 'creator'],
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

  async search(page = 1, size = 10, sort = 'id', search: string[] = []): Promise<PageResponse<PlaylistResponse>> {
    const qb = this.playlistRepo.createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.songs', 'songs')
      .leftJoinAndSelect('playlist.creator', 'creator');
    for (const s of search) {
      if (s.includes('~')) {
        const [field, val] = s.split('~');
        qb.andWhere(`playlist.${field} LIKE :${field}`, { [field]: `%${val}%` });
      } else if (s.includes('>')) {
        const [field, val] = s.split('>');
        qb.andWhere(`playlist.${field} > :${field}gt`, { [`${field}gt`]: val });
      } else if (s.includes('<')) {
        const [field, val] = s.split('<');
        qb.andWhere(`playlist.${field} < :${field}lt`, { [`${field}lt`]: val });
      }
    }
    qb.orderBy(`playlist.${sort}`, 'ASC').skip((page - 1) * size).take(size);
    const [items, total] = await qb.getManyAndCount();
    return { page, size, totalPages: Math.ceil(total / size), totalItems: total, items: items.map(this.toResponse.bind(this)) };
  }

  async update(id: number, dto: PlaylistRequest): Promise<PlaylistResponse> {
    const p = await this.findWithRelations(id);
    const songs = dto.songIds?.length ? await this.songRepo.findBy({ id: In(dto.songIds) }) : p.songs;
    const stats = this.calcStats(songs);
    Object.assign(p, { title: dto.title ?? p.title, description: dto.description ?? p.description, imageURL: dto.imageURL ?? p.imageURL, songs, ...stats });
    await this.playlistRepo.save(p);
    return this.toResponse(await this.findWithRelations(id));
  }

  async delete(id: number): Promise<void> {
    const p = await this.findWithRelations(id);
    await this.playlistRepo.manager.query('DELETE FROM user_saved_playlist WHERE playlist_id = ?', [id]);
    await this.playlistRepo.manager.query('DELETE FROM playlist_song WHERE playlist_id = ?', [id]);
    await this.playlistRepo.remove(p);
  }

  async removeSong(playlistId: number, songId: number): Promise<void> {
    const p = await this.findWithRelations(playlistId);
    p.songs = p.songs.filter((s) => s.id !== songId);
    const stats = this.calcStats(p.songs);
    Object.assign(p, stats);
    await this.playlistRepo.save(p);
  }
}
