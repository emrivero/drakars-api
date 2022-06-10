import { Controller, Get, Param } from '@nestjs/common';
import { SearchMunicipalityService } from '../../application/municipality/search';

@Controller('municipality')
export class MunicipalityController {
  constructor(private readonly searchService: SearchMunicipalityService) {}

  @Get('list/by-city/:cityId/:name')
  search(@Param('name') name: string, @Param('cityId') cityId: number) {
    if (name && name.length > 0) {
      return this.searchService.search(cityId, name);
    }
    return [];
  }
}
