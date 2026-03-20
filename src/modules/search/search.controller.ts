import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Search')
@Controller('v1/search-by-priority')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Search by priority' })
  @ApiQuery({ name: 'query', required: true })
  search(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('size') size = 10,
  ) {
    return this.searchService.searchByPriority(query, +page, +size);
  }
}
