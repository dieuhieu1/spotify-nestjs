import { Body, Controller, Delete, Get, Param, Post, Put, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlaylistService } from './playlist.service';
import { PlaylistRequest } from '../../dto/request/playlist.request.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Playlists')
@Controller('v1/playlists')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create playlist' })
  create(@Body() dto: PlaylistRequest, @CurrentUser() user: any) {
    return this.playlistService.create(dto, user?.id);
  }

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search playlists' })
  @ApiQuery({ name: 'search', required: false, isArray: true })
  search(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('sort') sort = 'id',
    @Query('search') search: string[] = [],
  ) {
    return this.playlistService.search(+page, +size, sort, Array.isArray(search) ? search : [search]);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get playlist by id' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.playlistService.findById(id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all playlists' })
  findAll(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('sort') sort = 'id',
  ) {
    return this.playlistService.findAll(+page, +size, sort);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update playlist' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: PlaylistRequest) {
    return this.playlistService.update(id, dto);
  }

  @Delete(':playlistId/songs/:songId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove song from playlist' })
  removeSong(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ) {
    return this.playlistService.removeSong(playlistId, songId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete playlist' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.playlistService.delete(id);
  }
}
