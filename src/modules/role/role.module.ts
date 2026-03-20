import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService, TypeOrmModule],
})
export class RoleModule {}
