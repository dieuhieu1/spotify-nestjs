import { Body, Controller, Delete, Get, Param, Post, Put, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ArtistService } from './artist.service';
import { ArtistRequest } from '../../dto/request/artist.request.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Artists')
@Controller('v1/artists')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create artist' })
  create(@Body() dto: ArtistRequest) {
    return this.artistService.create(dto);
  }

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search artists' })
  @ApiQuery({ name: 'search', required: false, isArray: true })
  search(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('sort') sort = 'id',
    @Query('search') search: string[] = [],
  ) {
    return this.artistService.search(+page, +size, sort, Array.isArray(search) ? search : [search]);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get artist by id' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.findById(id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all artists' })
  findAll(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('sort') sort = 'id',
  ) {
    return this.artistService.findAll(+page, +size, sort);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update artist' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: ArtistRequest) {
    return this.artistService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete artist' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.delete(id);
  }
}
