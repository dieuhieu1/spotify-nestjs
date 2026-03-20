import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_artist')
export class Artist {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'bigint', default: 0 })
  follower: number;

  @Column({ nullable: true })
  imageURL: string;
}
