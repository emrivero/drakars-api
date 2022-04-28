import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { CreateOfficeService } from '../../../application/create';
import { DeleteOfficeService } from '../../../application/delete';
import { GetOfficeService } from '../../../application/get-by-id';
import { PaginateOfficeService } from '../../../application/paginate';
import { TransferOfficeVehiclesService } from '../../../application/transfer-vehicles';
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
    public transferService: TransferOfficeVehiclesService,
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

  @Get(':id')
  async getById(@Param('id') id: number) {
    const office = await this.getService.getById(id);

    if (!office) {
      throw new NotFoundException(`Office with id=${id} not found.`);
    }
    return office;
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: CreateOfficeDto) {
    const office = Office.fromDto(dto);
    return this.updateService.update(id, office);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.deleteService.delete(id);
  }

  @Patch('transfer/:oldOfficeId/:newOfficeId')
  transferVehicles(
    @Param('oldOfficeId') oldOfficeId: number,
    @Param('newOfficeId') newOfficeId: number,
  ) {
    return this.transferService.transfer(oldOfficeId, newOfficeId);
  }
}
