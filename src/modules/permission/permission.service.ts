import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionRequest } from '../../dto/request/permission.request.dto';
import { PermissionResponse } from '../../dto/response/permission.response.dto';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}

  private toResponse(p: Permission): PermissionResponse {
    return { id: p.id, name: p.name, description: p.description };
  }

  async create(dto: PermissionRequest): Promise<PermissionResponse> {
    const exists = await this.permissionRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new AppException(ErrorCode.SONG_EXISTED);
    const permission = this.permissionRepo.create(dto);
    return this.toResponse(await this.permissionRepo.save(permission));
  }

  async findById(id: number): Promise<PermissionResponse> {
    const p = await this.permissionRepo.findOne({ where: { id } });
    if (!p) throw new AppException(ErrorCode.PERMISSION_NOT_EXISTED);
    return this.toResponse(p);
  }

  async findAll(): Promise<PermissionResponse[]> {
    const list = await this.permissionRepo.find();
    return list.map(this.toResponse);
  }

  async update(id: number, dto: PermissionRequest): Promise<PermissionResponse> {
    const p = await this.permissionRepo.findOne({ where: { id } });
    if (!p) throw new AppException(ErrorCode.PERMISSION_NOT_EXISTED);
    Object.assign(p, dto);
    return this.toResponse(await this.permissionRepo.save(p));
  }

  async delete(id: number): Promise<void> {
    const p = await this.permissionRepo.findOne({ where: { id } });
    if (!p) throw new AppException(ErrorCode.PERMISSION_NOT_EXISTED);
    await this.permissionRepo.remove(p);
  }
}
