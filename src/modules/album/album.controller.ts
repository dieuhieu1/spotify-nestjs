import { Body, Controller, Delete, Get, Param, Post, Put, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { AlbumRequest } from '../../dto/request/album.request.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Albums')
@Controller('v1/albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create album' })
  create(@Body() dto: AlbumRequest) {
    return this.albumService.create(dto);
  }

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search albums' })
  @ApiQuery({ name: 'search', required: false, isArray: true })
  search(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('sort') sort = 'id',
    @Query('search') search: string[] = [],
  ) {
    return this.albumService.search(+page, +size, sort, Array.isArray(search) ? search : [search]);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get album by id' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.albumService.findById(id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all albums' })
  findAll(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('sort') sort = 'id',
  ) {
    return this.albumService.findAll(+page, +size, sort);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update album' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: AlbumRequest) {
    return this.albumService.update(id, dto);
  }

  @Delete(':albumId/songs/:songId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove song from album' })
  removeSong(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ) {
    return this.albumService.removeSong(albumId, songId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete album and all its songs' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.albumService.delete(id);
  }
}
