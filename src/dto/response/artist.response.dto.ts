import { AlbumBasic } from '../basic/album-basic.dto';
import { SongBasic } from '../basic/song-basic.dto';

export class ArtistResponse {
  id: number;
  name: string;
  follower: number;
  imageURL: string;
  albums: AlbumBasic[];
  songs: SongBasic[];
}
