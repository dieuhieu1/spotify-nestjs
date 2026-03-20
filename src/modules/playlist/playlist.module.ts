import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { Song } from '../song/entities/song.entity';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song])],
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService, TypeOrmModule],
})
export class PlaylistModule {}
