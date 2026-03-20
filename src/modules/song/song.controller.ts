import { Body, Controller, Delete, Get, Param, Post, Put, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SongService } from './song.service';
import { SongRequest } from '../../dto/request/song.request.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Songs')
@Controller('v1/songs')
export class SongController {
  constructor(private songService: SongService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create song' })
  create(@Body() dto: SongRequest) {
    return this.songService.create(dto);
  }

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search songs' })
  @ApiQuery({ name: 'search', required: false, isArray: true })
  search(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('sort') sort = 'id',
    @Query('search') search: string[] = [],
  ) {
    return this.songService.search(+page, +size, sort, Array.isArray(search) ? search : [search]);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get song by id' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.songService.findById(id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all songs' })
  findAll(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('sort') sort = 'id',
  ) {
    return this.songService.findAll(+page, +size, sort);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update song' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: SongRequest) {
    return this.songService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete song' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.songService.delete(id);
  }
}
