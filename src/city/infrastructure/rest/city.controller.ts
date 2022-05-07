import { Controller, Get, Param } from '@nestjs/common';
import { SearchCityService } from '../../application/search';

@Controller('city')
export class CityController {
  constructor(private readonly searchService: SearchCityService) {}

  @Get('search/:name')
  search(@Param('name') name: string) {
    if (name && name.length > 1) {
      return this.searchService.search(name);
    }
    return [];
  }
}
