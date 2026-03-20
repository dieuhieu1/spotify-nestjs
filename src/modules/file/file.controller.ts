import {
  Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { FileType } from '../../common/enums/file-type.enum';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('v1/files')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'fileType', enum: FileType })
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('fileType') fileType: FileType,
  ) {
    return this.fileService.upload(file, fileType);
  }

  @Get()
  @ApiOperation({ summary: 'Get all files' })
  findAll() {
    return this.fileService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  delete(@Param('id') id: string) {
    return this.fileService.delete(id);
  }
}
