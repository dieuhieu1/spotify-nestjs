import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'text', unique: true })
  refreshToken: string;

  @Column({ type: 'datetime' })
  expiryDate: Date;
}
