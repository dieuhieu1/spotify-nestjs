import { Body, Controller, Delete, Get, Param, Post, Put, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { RoleRequest } from '../../dto/request/role.request.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('v1/roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create role' })
  create(@Body() dto: RoleRequest) {
    return this.roleService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by id' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  findAll() {
    return this.roleService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update role' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: RoleRequest) {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id);
  }
}
