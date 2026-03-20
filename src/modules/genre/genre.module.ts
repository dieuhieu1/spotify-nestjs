import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { SongModule } from '../song/song.module';

@Module({
  imports: [TypeOrmModule.forFeature([Genre]), forwardRef(() => SongModule)],
  providers: [GenreService],
  controllers: [GenreController],
  exports: [GenreService, TypeOrmModule],
})
export class GenreModule {}
