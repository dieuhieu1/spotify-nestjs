import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tbl_invalidated_token')
export class InvalidatedToken {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'datetime' })
  expiryTime: Date;
}
