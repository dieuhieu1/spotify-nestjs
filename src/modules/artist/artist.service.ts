import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { ArtistRequest } from '../../dto/request/artist.request.dto';
import { ArtistResponse } from '../../dto/response/artist.response.dto';
import { PageResponse } from '../../dto/response/page-response.dto';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistRepo: Repository<Artist>,
  ) {}

  async toResponse(a: Artist): Promise<ArtistResponse> {
    const songs = await this.artistRepo.manager
      .createQueryBuilder()
      .select(['s.id', 's.name', 's.duration', 's.imageURL'])
      .from('tbl_song', 's')
      .innerJoin('song_artist', 'sa', 'sa.song_id = s.id AND sa.artist_id = :aid', { aid: a.id })
      .getRawMany();

    const albums = await this.artistRepo.manager
      .createQueryBuilder()
      .select(['al.id', 'al.name', 'al.imageURL'])
      .from('tbl_album', 'al')
      .innerJoin('album_artist', 'aa', 'aa.album_id = al.id AND aa.artist_id = :aid', { aid: a.id })
      .getRawMany();

    return {
      id: a.id,
      name: a.name,
      follower: a.follower,
      imageURL: a.imageURL,
      songs: songs.map((s) => ({ id: s.s_id, name: s.s_name, duration: s.s_duration, imageURL: s.s_imageURL })),
      albums: albums.map((al) => ({ id: al.al_id, name: al.al_name, imageURL: al.al_imageURL })),
    };
  }

  async create(dto: ArtistRequest): Promise<ArtistResponse> {
    const exists = await this.artistRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new AppException(ErrorCode.ARTIST_EXISTED);
    const artist = await this.artistRepo.save(this.artistRepo.create(dto));
    return this.toResponse(artist);
  }

  async findById(id: number): Promise<ArtistResponse> {
    const a = await this.artistRepo.findOne({ where: { id } });
    if (!a) throw new AppException(ErrorCode.ARTIST_NOT_EXISTED);
    await this.artistRepo.increment({ id }, 'follower', 1);
    a.follower = Number(a.follower) + 1;
    return this.toResponse(a);
  }

  async findAll(page = 1, size = 10, sort = 'id'): Promise<PageResponse<ArtistResponse>> {
    const [items, total] = await this.artistRepo.findAndCount({
      order: { [sort]: 'ASC' },
      skip: (page - 1) * size,
      take: size,
    });
    return {
      page,
      size,
      totalPages: Math.ceil(total / size),
      totalItems: total,
      items: await Promise.all(items.map((a) => this.toResponse(a))),
    };
  }

  async search(page = 1, size = 10, sort = 'id', search: string[] = []): Promise<PageResponse<ArtistResponse>> {
    const qb = this.artistRepo.createQueryBuilder('artist');
    for (const s of search) {
      if (s.includes('~')) {
        const [field, val] = s.split('~');
        qb.andWhere(`artist.${field} LIKE :${field}`, { [field]: `%${val}%` });
      } else if (s.includes('>')) {
        const [field, val] = s.split('>');
        qb.andWhere(`artist.${field} > :${field}gt`, { [`${field}gt`]: val });
      } else if (s.includes('<')) {
        const [field, val] = s.split('<');
        qb.andWhere(`artist.${field} < :${field}lt`, { [`${field}lt`]: val });
      }
    }
    qb.orderBy(`artist.${sort}`, 'ASC').skip((page - 1) * size).take(size);
    const [items, total] = await qb.getManyAndCount();
    return {
      page, size,
      totalPages: Math.ceil(total / size),
      totalItems: total,
      items: await Promise.all(items.map((a) => this.toResponse(a))),
    };
  }

  async update(id: number, dto: ArtistRequest): Promise<ArtistResponse> {
    const a = await this.artistRepo.findOne({ where: { id } });
    if (!a) throw new AppException(ErrorCode.ARTIST_NOT_EXISTED);
    Object.assign(a, dto);
    return this.toResponse(await this.artistRepo.save(a));
  }

  async delete(id: number): Promise<void> {
    const a = await this.artistRepo.findOne({ where: { id } });
    if (!a) throw new AppException(ErrorCode.ARTIST_NOT_EXISTED);
    await this.artistRepo.manager.query('DELETE FROM song_artist WHERE artist_id = ?', [id]);
    await this.artistRepo.manager.query('DELETE FROM album_artist WHERE artist_id = ?', [id]);
    await this.artistRepo.remove(a);
  }
}
