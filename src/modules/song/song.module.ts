import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Genre } from '../genre/entities/genre.entity';
import { SongService } from './song.service';
import { SongController } from './song.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist, Genre])],
  providers: [SongService],
  controllers: [SongController],
  exports: [SongService, TypeOrmModule],
})
export class SongModule {}
