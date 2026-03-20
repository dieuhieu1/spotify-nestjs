import { Body, Controller, Delete, Get, Param, Post, Put, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenreService } from './genre.service';
import { SongService } from '../song/song.service';
import { GenreRequest } from '../../dto/request/genre.request.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Genres')
@Controller('v1/genres')
export class GenreController {
  constructor(
    private genreService: GenreService,
    private songService: SongService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create genre' })
  create(@Body() dto: GenreRequest) {
    return this.genreService.create(dto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get genre by id' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.findById(id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all genres' })
  findAll() {
    return this.genreService.findAll();
  }

  @Get(':genreId/songs')
  @Public()
  @ApiOperation({ summary: 'Get songs by genre' })
  getSongsByGenre(@Param('genreId', ParseIntPipe) genreId: number) {
    return this.songService.findByGenre(genreId);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update genre' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: GenreRequest) {
    return this.genreService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete genre' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.delete(id);
  }
}
