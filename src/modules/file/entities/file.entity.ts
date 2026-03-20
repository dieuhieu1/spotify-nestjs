import { Column, Entity, PrimaryColumn } from 'typeorm';
import { FileType } from '../../../common/enums/file-type.enum';

@Entity('tbl_file')
export class FileEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  fileName: string;

  @Column()
  url: string;

  @Column({ type: 'enum', enum: FileType })
  type: FileType;

  @Column({ type: 'double', nullable: true })
  duration: number;
}
