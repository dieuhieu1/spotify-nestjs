import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Playlist } from '../../playlist/entities/playlist.entity';

@Entity('tbl_user')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  imageURL: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;

  @Column({ default: false })
  premiumStatus: boolean;

  @Column({ type: 'date', nullable: true })
  premiumExpiryDate: Date;

  @ManyToMany(() => Role, { eager: true, cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @OneToMany(() => Playlist, (playlist) => playlist.creator)
  createdPlaylists: Playlist[];

  @ManyToMany(() => Playlist, { cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'user_saved_playlist',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'playlist_id' },
  })
  savedPlaylists: Playlist[];
}
