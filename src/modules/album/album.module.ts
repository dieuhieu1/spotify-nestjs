import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Song } from '../song/entities/song.entity';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Artist, Song])],
  providers: [AlbumService],
  controllers: [AlbumController],
  exports: [AlbumService, TypeOrmModule],
})
export class AlbumModule {}
