import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_forgot_password_token')
export class ForgotPasswordToken {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  email: string;

  @Column({ length: 1024 })
  forgotPasswordToken: string;

  @Column({ type: 'datetime' })
  expiryTime: Date;
}
