import { UserBasic } from '../basic/user-basic.dto';
import { SongBasic } from '../basic/song-basic.dto';

export class PlaylistResponse {
  id: number;
  title: string;
  description: string;
  totalTracks: number;
  follower: number;
  listener: number;
  imageURL: string;
  totalHours: number;
  createdAt: Date;
  updatedAt: Date;
  creator: UserBasic;
  songs: SongBasic[];
}
