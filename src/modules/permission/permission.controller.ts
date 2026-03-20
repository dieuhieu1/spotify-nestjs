import { Body, Controller, Delete, Get, Param, Post, Put, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { PermissionRequest } from '../../dto/request/permission.request.dto';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('v1/permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Create permission' })
  create(@Body() dto: PermissionRequest) {
    return this.permissionService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get permission by id' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  findAll() {
    return this.permissionService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update permission' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: PermissionRequest) {
    return this.permissionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete permission' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.delete(id);
  }
}
