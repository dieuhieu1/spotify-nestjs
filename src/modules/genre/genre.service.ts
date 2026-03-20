import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { GenreRequest } from '../../dto/request/genre.request.dto';
import { GenreResponse } from '../../dto/response/genre.response.dto';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre) private genreRepo: Repository<Genre>,
  ) {}

  toResponse(g: Genre): GenreResponse {
    return { id: g.id, name: g.name };
  }

  async create(dto: GenreRequest): Promise<GenreResponse> {
    const exists = await this.genreRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new AppException(ErrorCode.GENRE_EXISTED);
    return this.toResponse(await this.genreRepo.save(this.genreRepo.create(dto)));
  }

  async findById(id: number): Promise<GenreResponse> {
    const g = await this.genreRepo.findOne({ where: { id } });
    if (!g) throw new AppException(ErrorCode.GENRE_NOT_EXISTED);
    return this.toResponse(g);
  }

  async findAll(): Promise<GenreResponse[]> {
    return (await this.genreRepo.find()).map(this.toResponse);
  }

  async update(id: number, dto: GenreRequest): Promise<GenreResponse> {
    const g = await this.genreRepo.findOne({ where: { id } });
    if (!g) throw new AppException(ErrorCode.GENRE_NOT_EXISTED);
    g.name = dto.name;
    return this.toResponse(await this.genreRepo.save(g));
  }

  async delete(id: number): Promise<void> {
    const g = await this.genreRepo.findOne({ where: { id } });
    if (!g) throw new AppException(ErrorCode.GENRE_NOT_EXISTED);
    await this.genreRepo.remove(g);
  }
}
