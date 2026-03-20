import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../song/entities/song.entity';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Playlist } from '../playlist/entities/playlist.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Song) private songRepo: Repository<Song>,
    @InjectRepository(Album) private albumRepo: Repository<Album>,
    @InjectRepository(Artist) private artistRepo: Repository<Artist>,
    @InjectRepository(Playlist) private playlistRepo: Repository<Playlist>,
  ) {}

  async searchByPriority(query: string, page = 1, size = 10) {
    const like = `%${query}%`;
    const skip = (page - 1) * size;

    const [songs, albums, artists, playlists] = await Promise.all([
      this.songRepo.createQueryBuilder('s')
        .leftJoinAndSelect('s.artists', 'artists')
        .leftJoinAndSelect('s.genre', 'genre')
        .leftJoinAndSelect('s.album', 'album')
        .where('s.name LIKE :like', { like })
        .orderBy('s.listener', 'DESC')
        .getMany(),
      this.albumRepo.createQueryBuilder('a')
        .leftJoinAndSelect('a.artists', 'artists')
        .leftJoinAndSelect('a.songs', 'songs')
        .where('a.name LIKE :like', { like })
        .orderBy('a.follower', 'DESC')
        .getMany(),
      this.artistRepo.createQueryBuilder('ar')
        .where('ar.name LIKE :like', { like })
        .orderBy('ar.follower', 'DESC')
        .getMany(),
      this.playlistRepo.createQueryBuilder('p')
        .leftJoinAndSelect('p.songs', 'songs')
        .leftJoinAndSelect('p.creator', 'creator')
        .where('p.title LIKE :like', { like })
        .orderBy('p.listener', 'DESC')
        .getMany(),
    ]);

    const results = [
      ...artists.map((a) => ({ type: 'ARTIST', id: a.id, name: a.name, imageURL: a.imageURL, follower: a.follower })),
      ...songs.map((s) => ({ type: 'SONG', id: s.id, name: s.name, imageURL: s.imageURL, listener: s.listener })),
      ...albums.map((a) => ({ type: 'ALBUM', id: a.id, name: a.name, imageURL: a.imageURL, follower: a.follower })),
      ...playlists.map((p) => ({ type: 'PLAYLIST', id: p.id, name: p.title, imageURL: p.imageURL, listener: p.listener })),
    ];

    const total = results.length;
    const items = results.slice(skip, skip + size);

    return {
      page, size,
      totalPages: Math.ceil(total / size),
      totalItems: total,
      items,
    };
  }
}
