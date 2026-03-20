import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Song } from './entities/song.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Genre } from '../genre/entities/genre.entity';
import { SongRequest } from '../../dto/request/song.request.dto';
import { SongResponse } from '../../dto/response/song.response.dto';
import { SongBasic } from '../../dto/basic/song-basic.dto';
import { PageResponse } from '../../dto/response/page-response.dto';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song) private songRepo: Repository<Song>,
    @InjectRepository(Artist) private artistRepo: Repository<Artist>,
    @InjectRepository(Genre) private genreRepo: Repository<Genre>,
  ) {}

  toResponse(s: Song): SongResponse {
    return {
      id: s.id,
      name: s.name,
      description: s.description,
      duration: s.duration,
      listener: s.listener,
      imageURL: s.imageURL,
      fileSongURL: s.fileSongURL,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      album: s.album ? { id: s.album.id, name: s.album.name, imageURL: s.album.imageURL } : null,
      artists: (s.artists || []).map((a) => ({ id: a.id, name: a.name, imageURL: a.imageURL })),
      genre: s.genre ? { id: s.genre.id, name: s.genre.name } : null,
    };
  }

  toBasic(s: Song): SongBasic {
    return { id: s.id, name: s.name, duration: s.duration, imageURL: s.imageURL };
  }

  private async findWithRelations(id: number): Promise<Song> {
    const s = await this.songRepo.findOne({ where: { id }, relations: ['artists', 'genre', 'album'] });
    if (!s) throw new AppException(ErrorCode.SONG_NOT_EXISTED);
    return s;
  }

  async create(dto: SongRequest): Promise<SongResponse> {
    const exists = await this.songRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new AppException(ErrorCode.SONG_EXISTED);

    const artists = await this.artistRepo.findBy({ id: In(dto.artistIds) });
    const genre = dto.genreId ? await this.genreRepo.findOne({ where: { id: dto.genreId } }) : null;

    const song = this.songRepo.create({
      name: dto.name,
      description: dto.description,
      imageURL: dto.imageURL,
      fileSongURL: dto.fileSongURL,
      duration: dto.duration || 0,
      listener: dto.listener || 0,
      artists,
      genre,
    });
    return this.toResponse(await this.songRepo.save(song));
  }

  async findById(id: number): Promise<SongResponse> {
    const s = await this.findWithRelations(id);
    await this.songRepo.increment({ id }, 'listener', 1);
    s.listener = Number(s.listener) + 1;
    return this.toResponse(s);
  }

  async findAll(page = 1, size = 10, sort = 'id'): Promise<PageResponse<SongResponse>> {
    const [items, total] = await this.songRepo.findAndCount({
      relations: ['artists', 'genre', 'album'],
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

  async findByGenre(genreId: number): Promise<SongResponse[]> {
    const songs = await this.songRepo.find({
      where: { genre: { id: genreId } },
      relations: ['artists', 'genre', 'album'],
    });
    return songs.map(this.toResponse.bind(this));
  }

  async search(page = 1, size = 10, sort = 'id', search: string[] = []): Promise<PageResponse<SongResponse>> {
    const qb = this.songRepo.createQueryBuilder('song')
      .leftJoinAndSelect('song.artists', 'artists')
      .leftJoinAndSelect('song.genre', 'genre')
      .leftJoinAndSelect('song.album', 'album');
    for (const s of search) {
      if (s.includes('~')) {
        const [field, val] = s.split('~');
        qb.andWhere(`song.${field} LIKE :${field}`, { [field]: `%${val}%` });
      } else if (s.includes('>')) {
        const [field, val] = s.split('>');
        qb.andWhere(`song.${field} > :${field}gt`, { [`${field}gt`]: val });
      } else if (s.includes('<')) {
        const [field, val] = s.split('<');
        qb.andWhere(`song.${field} < :${field}lt`, { [`${field}lt`]: val });
      }
    }
    qb.orderBy(`song.${sort}`, 'ASC').skip((page - 1) * size).take(size);
    const [items, total] = await qb.getManyAndCount();
    return {
      page, size,
      totalPages: Math.ceil(total / size),
      totalItems: total,
      items: items.map(this.toResponse.bind(this)),
    };
  }

  async update(id: number, dto: SongRequest): Promise<SongResponse> {
    const s = await this.findWithRelations(id);
    const artists = await this.artistRepo.findBy({ id: In(dto.artistIds) });
    const genre = dto.genreId ? await this.genreRepo.findOne({ where: { id: dto.genreId } }) : null;
    Object.assign(s, { name: dto.name, description: dto.description, imageURL: dto.imageURL, fileSongURL: dto.fileSongURL, duration: dto.duration, artists, genre });
    return this.toResponse(await this.songRepo.save(s));
  }

  async delete(id: number): Promise<void> {
    const s = await this.findWithRelations(id);
    await this.songRepo.manager.query('DELETE FROM playlist_song WHERE song_id = ?', [id]);
    if (s.album) {
      const album = await this.songRepo.manager.findOne(require('../album/entities/album.entity').Album, {
        where: { id: s.album.id },
        relations: ['songs'],
      });
      if (album) {
        album.songs = album.songs.filter((song) => song.id !== id);
        album.totalTracks = album.songs.length;
        album.totalHours = album.songs.reduce((sum, song) => sum + (song.duration || 0), 0) / 3600;
        await this.songRepo.manager.save(album);
      }
    }
    await this.songRepo.remove(s);
  }
}
