import { Body, Controller, Delete, Get, Param, Post, Put, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserRequest, UserUpdateRequest } from '../../dto/request/user.request.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  create(@Body() dto: UserRequest) {
    return this.userService.create(dto);
  }

  @Get('saved-playlists')
  @ApiOperation({ summary: 'Get saved playlists' })
  getSavedPlaylists(
    @CurrentUser() user: any,
    @Query('page') page = 1,
    @Query('size') size = 10,
  ) {
    return this.userService.getSavedPlaylists(user.id, +page, +size);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('sort') sort = 'id',
  ) {
    return this.userService.findAll(+page, +size, sort);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UserUpdateRequest) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }

  @Post('saved-playlist/:playlistId')
  @ApiOperation({ summary: 'Save playlist' })
  savePlaylist(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @CurrentUser() user: any,
  ) {
    return this.userService.savePlaylist(user.id, playlistId);
  }

  @Delete('saved-playlist/:playlistId')
  @ApiOperation({ summary: 'Remove saved playlist' })
  removeSavedPlaylist(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @CurrentUser() user: any,
  ) {
    return this.userService.removeSavedPlaylist(user.id, playlistId);
  }
}
