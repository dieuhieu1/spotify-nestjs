import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '../song/entities/song.entity';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Playlist } from '../playlist/entities/playlist.entity';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Album, Artist, Playlist])],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
