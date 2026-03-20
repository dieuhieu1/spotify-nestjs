import { AlbumBasic } from '../basic/album-basic.dto';
import { ArtistBasic } from '../basic/artist-basic.dto';
import { GenreResponse } from './genre.response.dto';

export class SongResponse {
  id: number;
  name: string;
  description: string;
  duration: number;
  listener: number;
  imageURL: string;
  fileSongURL: string;
  createdAt: Date;
  updatedAt: Date;
  album: AlbumBasic | null;
  artists: ArtistBasic[];
  genre: GenreResponse | null;
}
