import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('tbl_role')
export class Role {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Permission, { eager: true, cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: Permission[];
}
