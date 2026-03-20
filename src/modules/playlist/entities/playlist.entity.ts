import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Song } from '../../song/entities/song.entity';

@Entity('tbl_playlist')
export class Playlist {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  totalTracks: number;

  @Column({ type: 'bigint', default: 0 })
  follower: number;

  @Column({ type: 'bigint', default: 0 })
  listener: number;

  @Column({ nullable: true })
  imageURL: string;

  @Column({ type: 'double', default: 0 })
  totalHours: number;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;

  @ManyToOne('User', 'createdPlaylists', { nullable: true })
  @JoinColumn({ name: 'creator_id' })
  creator: any;

  @ManyToMany(() => Song, { eager: true, cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'playlist_song',
    joinColumn: { name: 'playlist_id' },
    inverseJoinColumn: { name: 'song_id' },
  })
  songs: Song[];
}
