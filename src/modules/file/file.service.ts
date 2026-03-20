import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { FileEntity } from './entities/file.entity';
import { FileType } from '../../common/enums/file-type.enum';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class FileService {
  private readonly IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private readonly VIDEO_MIME_TYPES = [
    'video/mp4', 'video/avi', 'video/mov', 'video/mkv',
    'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm',
    'audio/m4a', 'audio/aac', 'audio/flac', 'audio/mpeg',
  ];
  private readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024;
  private readonly MAX_VIDEO_SIZE = 100 * 1024 * 1024;

  constructor(
    @InjectRepository(FileEntity) private fileRepo: Repository<FileEntity>,
    private configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(file: Express.Multer.File, fileType: FileType): Promise<FileEntity> {
    if (!file || !file.buffer) throw new AppException(ErrorCode.FILE_EMPTY);

    if (fileType === FileType.IMAGE) {
      if (!this.IMAGE_MIME_TYPES.includes(file.mimetype)) throw new AppException(ErrorCode.FILE_TYPE_INVALID);
      if (file.size > this.MAX_IMAGE_SIZE) throw new AppException(ErrorCode.FILE_TOO_LARGE);
    } else {
      if (!this.VIDEO_MIME_TYPES.includes(file.mimetype)) throw new AppException(ErrorCode.FILE_TYPE_INVALID);
      if (file.size > this.MAX_VIDEO_SIZE) throw new AppException(ErrorCode.FILE_TOO_LARGE);
    }

    const folder = fileType === FileType.IMAGE
      ? this.configService.get('CLOUDINARY_FOLDER_IMAGE', 'mymusic/images')
      : this.configService.get('CLOUDINARY_FOLDER_VIDEO', 'mymusic/videos');

    const resourceType = fileType === FileType.IMAGE ? 'image' : 'video';

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder, resource_type: resourceType },
        (error, result) => error ? reject(error) : resolve(result),
      ).end(file.buffer);
    });

    const entity = this.fileRepo.create({
      id: result.public_id,
      fileName: file.originalname,
      url: result.secure_url,
      type: fileType,
      duration: result.duration ?? null,
    });

    return this.fileRepo.save(entity);
  }

  async findAll(): Promise<FileEntity[]> {
    return this.fileRepo.find();
  }

  async delete(id: string): Promise<boolean> {
    const f = await this.fileRepo.findOne({ where: { id } });
    if (!f) return false;
    const resourceType = f.type === FileType.IMAGE ? 'image' : 'video';
    await cloudinary.uploader.destroy(id, { resource_type: resourceType });
    await this.fileRepo.remove(f);
    return true;
  }
}
