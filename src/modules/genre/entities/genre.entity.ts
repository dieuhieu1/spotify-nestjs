import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_genre')
export class Genre {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ unique: true })
  name: string;
}
