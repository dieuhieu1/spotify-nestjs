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
import { Artist } from '../../artist/entities/artist.entity';
import { Song } from '../../song/entities/song.entity';

@Entity('tbl_album')
export class Album {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  totalTracks: number;

  @Column({ type: 'bigint', default: 0 })
  follower: number;

  @Column({ nullable: true })
  imageURL: string;

  @Column({ type: 'double', default: 0 })
  totalHours: number;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;

  @ManyToMany(() => Artist, { eager: true, cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'album_artist',
    joinColumn: { name: 'album_id' },
    inverseJoinColumn: { name: 'artist_id' },
  })
  artists: Artist[];

  @OneToMany(() => Song, (song) => song.album, { eager: true, cascade: ['insert', 'update'] })
  songs: Song[];
}
