import { ArtistBasic } from '../basic/artist-basic.dto';
import { SongBasic } from '../basic/song-basic.dto';

export class AlbumResponse {
  id: number;
  name: string;
  description: string;
  totalTracks: number;
  follower: number;
  imageURL: string;
  totalHours: number;
  createdAt: Date;
  updatedAt: Date;
  artists: ArtistBasic[];
  songs: SongBasic[];
}
