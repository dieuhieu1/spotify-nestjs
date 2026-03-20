import { RoleResponse } from './role.response.dto';
import { PlaylistResponse } from './playlist.response.dto';

export class UserResponse {
  id: number;
  name: string;
  email: string;
  imageURL: string;
  dob: Date;
  createdPlaylists: PlaylistResponse[];
  savedPlaylistId: number[];
  createdAt: Date;
  updatedAt: Date;
  roles: RoleResponse[];
  premiumStatus: boolean;
  premiumExpiryDate: Date;
}
