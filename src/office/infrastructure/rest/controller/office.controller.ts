import { Body, Controller, Post } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { CreateOfficeService } from '../../../application/create';
import { DeleteOfficeService } from '../../../application/delete';
import { GetOfficeService } from '../../../application/get-by-id';
import { PaginateOfficeService } from '../../../application/paginate';
import { UpdateOfficeService } from '../../../application/update';
import { Office } from '../../../domain/models/office';
import { CreateOfficeDto } from '../dto/create-office.dto';

@Controller('office')
export class OfficeController {
  constructor(
    public createService: CreateOfficeService,
    public deleteService: DeleteOfficeService,
    public getService: GetOfficeService,
    public paginateService: PaginateOfficeService,
    public updateService: UpdateOfficeService,
  ) {}

  @Post()
  create(@Body() dto: CreateOfficeDto) {
    const office = Office.fromDto(dto);
    return this.createService.create(office, dto.municipality);
  }

  @Post('list')
  list(@Body() query: PaginateQuery) {
    return this.paginateService.list(query);
  }

  @Post('paginate')
  paginate(@Body() query: PaginateQuery) {
    return this.paginateService.paginate(query);
  }
}
