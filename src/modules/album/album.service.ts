import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Album } from './entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Song } from '../song/entities/song.entity';
import { AlbumRequest } from '../../dto/request/album.request.dto';
import { AlbumResponse } from '../../dto/response/album.response.dto';
import { PageResponse } from '../../dto/response/page-response.dto';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumRepo: Repository<Album>,
    @InjectRepository(Artist) private artistRepo: Repository<Artist>,
    @InjectRepository(Song) private songRepo: Repository<Song>,
  ) {}

  toResponse(a: Album): AlbumResponse {
    return {
      id: a.id,
      name: a.name,
      description: a.description,
      totalTracks: a.totalTracks,
      follower: a.follower,
      imageURL: a.imageURL,
      totalHours: a.totalHours,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      artists: (a.artists || []).map((ar) => ({ id: ar.id, name: ar.name, imageURL: ar.imageURL })),
      songs: (a.songs || []).map((s) => ({ id: s.id, name: s.name, duration: s.duration, imageURL: s.imageURL })),
    };
  }

  private calcStats(songs: Song[]) {
    return {
      totalTracks: songs.length,
      totalHours: songs.reduce((sum, s) => sum + (s.duration || 0), 0) / 3600,
    };
  }

  private async findWithRelations(id: number): Promise<Album> {
    const a = await this.albumRepo.findOne({ where: { id }, relations: ['artists', 'songs', 'songs.artists', 'songs.genre'] });
    if (!a) throw new AppException(ErrorCode.ALBUM_NOT_EXISTED);
    return a;
  }

  async create(dto: AlbumRequest): Promise<AlbumResponse> {
    const exists = await this.albumRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new AppException(ErrorCode.ALBUM_EXISTED);

    const artists = await this.artistRepo.findBy({ id: In(dto.artistIds) });
    const songs = await this.songRepo.findBy({ id: In(dto.songIds) });
    const stats = this.calcStats(songs);

    const album = this.albumRepo.create({ name: dto.name, description: dto.description, imageURL: dto.imageURL, artists, songs, ...stats });
    const saved = await this.albumRepo.save(album);
    return this.toResponse(await this.findWithRelations(saved.id));
  }

  async findById(id: number): Promise<AlbumResponse> {
    const a = await this.findWithRelations(id);
    await this.albumRepo.increment({ id }, 'follower', 1);
    a.follower = Number(a.follower) + 1;
    return this.toResponse(a);
  }

  async findAll(page = 1, size = 10, sort = 'id'): Promise<PageResponse<AlbumResponse>> {
    const [items, total] = await this.albumRepo.findAndCount({
      relations: ['artists', 'songs'],
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

  async search(page = 1, size = 10, sort = 'id', search: string[] = []): Promise<PageResponse<AlbumResponse>> {
    const qb = this.albumRepo.createQueryBuilder('album')
      .leftJoinAndSelect('album.artists', 'artists')
      .leftJoinAndSelect('album.songs', 'songs');
    for (const s of search) {
      if (s.includes('~')) {
        const [field, val] = s.split('~');
        qb.andWhere(`album.${field} LIKE :${field}`, { [field]: `%${val}%` });
      } else if (s.includes('>')) {
        const [field, val] = s.split('>');
        qb.andWhere(`album.${field} > :${field}gt`, { [`${field}gt`]: val });
      } else if (s.includes('<')) {
        const [field, val] = s.split('<');
        qb.andWhere(`album.${field} < :${field}lt`, { [`${field}lt`]: val });
      }
    }
    qb.orderBy(`album.${sort}`, 'ASC').skip((page - 1) * size).take(size);
    const [items, total] = await qb.getManyAndCount();
    return { page, size, totalPages: Math.ceil(total / size), totalItems: total, items: items.map(this.toResponse.bind(this)) };
  }

  async update(id: number, dto: AlbumRequest): Promise<AlbumResponse> {
    const a = await this.findWithRelations(id);
    const artists = await this.artistRepo.findBy({ id: In(dto.artistIds) });
    const songs = await this.songRepo.findBy({ id: In(dto.songIds) });
    const stats = this.calcStats(songs);
    Object.assign(a, { name: dto.name, description: dto.description, imageURL: dto.imageURL, artists, songs, ...stats });
    await this.albumRepo.save(a);
    return this.toResponse(await this.findWithRelations(id));
  }

  async delete(id: number): Promise<void> {
    const a = await this.findWithRelations(id);
    const songIds = a.songs.map((s) => s.id);
    if (songIds.length) {
      for (const sid of songIds) {
        await this.albumRepo.manager.query('DELETE FROM playlist_song WHERE song_id = ?', [sid]);
        await this.albumRepo.manager.query('DELETE FROM song_artist WHERE song_id = ?', [sid]);
      }
      await this.songRepo.delete({ id: In(songIds) });
    }
    await this.albumRepo.remove(a);
  }

  async removeSong(albumId: number, songId: number): Promise<void> {
    const a = await this.findWithRelations(albumId);
    a.songs = a.songs.filter((s) => s.id !== songId);
    const stats = this.calcStats(a.songs);
    Object.assign(a, stats);
    await this.albumRepo.save(a);
  }
}
