import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { RoleRequest } from '../../dto/request/role.request.dto';
import { RoleResponse } from '../../dto/response/role.response.dto';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permissionRepo: Repository<Permission>,
  ) {}

  toResponse(r: Role): RoleResponse {
    return {
      id: r.id,
      name: r.name,
      description: r.description,
      permissions: (r.permissions || []).map((p) => ({ id: p.id, name: p.name, description: p.description })),
    };
  }

  async create(dto: RoleRequest): Promise<RoleResponse> {
    const permissions = dto.permissionIds?.length
      ? await this.permissionRepo.findBy({ id: In(dto.permissionIds) })
      : [];
    const role = this.roleRepo.create({ name: dto.name, description: dto.description, permissions });
    return this.toResponse(await this.roleRepo.save(role));
  }

  async findById(id: number): Promise<RoleResponse> {
    const r = await this.roleRepo.findOne({ where: { id } });
    if (!r) throw new AppException(ErrorCode.ROLE_NOT_EXISTED);
    return this.toResponse(r);
  }

  async findAll(): Promise<RoleResponse[]> {
    return (await this.roleRepo.find()).map(this.toResponse.bind(this));
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepo.findOne({ where: { name } });
  }

  async update(id: number, dto: RoleRequest): Promise<RoleResponse> {
    const r = await this.roleRepo.findOne({ where: { id } });
    if (!r) throw new AppException(ErrorCode.ROLE_NOT_EXISTED);
    r.name = dto.name ?? r.name;
    r.description = dto.description ?? r.description;
    if (dto.permissionIds) {
      r.permissions = await this.permissionRepo.findBy({ id: In(dto.permissionIds) });
    }
    return this.toResponse(await this.roleRepo.save(r));
  }

  async delete(id: number): Promise<void> {
    const r = await this.roleRepo.findOne({ where: { id } });
    if (!r) throw new AppException(ErrorCode.ROLE_NOT_EXISTED);
    await this.roleRepo.remove(r);
  }
}
