import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileEntity } from './entities/file.entity';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.register({ storage: memoryStorage() }),
  ],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
