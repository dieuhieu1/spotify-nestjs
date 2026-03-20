import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_permission')
export class Permission {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;
}
