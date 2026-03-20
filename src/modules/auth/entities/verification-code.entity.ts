import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_verification_code')
export class VerificationCode {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  email: string;

  @Column()
  verificationCode: string;

  @Column({ type: 'bigint' })
  expirationTime: number;
}
