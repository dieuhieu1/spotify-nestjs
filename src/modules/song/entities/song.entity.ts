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
import { Artist } from '../../artist/entities/artist.entity';
import { Genre } from '../../genre/entities/genre.entity';

@Entity('tbl_song')
export class Song {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'double', default: 0 })
  duration: number;

  @Column({ type: 'bigint', default: 0 })
  listener: number;

  @Column({ nullable: true })
  imageURL: string;

  @Column({ nullable: true })
  fileSongURL: string;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;

  @ManyToOne('Album', 'songs', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'album_id' })
  album: any;

  @ManyToMany(() => Artist, { eager: true, cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'song_artist',
    joinColumn: { name: 'song_id' },
    inverseJoinColumn: { name: 'artist_id' },
  })
  artists: Artist[];

  @ManyToOne(() => Genre, { nullable: true, eager: true })
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;
}
