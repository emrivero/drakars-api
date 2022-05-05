import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { CreateVehicleService } from '../../../application/create';
import { DeleteVehicleService } from '../../../application/delete';
import { GetVehicleService } from '../../../application/get-vehicle-by-id';
import { PaginateVehicleService } from '../../../application/paginate';
import { UpdateVehicleService } from '../../../application/update';
import { Vehicle } from '../../../domain/models/vehicle';
import { CreateVehicleDto } from '../dtos/create-vehicle';

@Controller('vehicle')
export class VehicleController {
  constructor(
    private createVehicleService: CreateVehicleService,
    private paginateVehicleService: PaginateVehicleService,
    private getVehicleService: GetVehicleService,
    private updateVehicleService: UpdateVehicleService,
    private deleteVehicleService: DeleteVehicleService,
  ) {}

  @Post()
  create(@Body() vehicle: CreateVehicleDto) {
    const newVehicle = Vehicle.fromDto(vehicle);
    return this.createVehicleService.create(newVehicle, vehicle.office);
  }

  @Post('/paginate')
  @HttpCode(200)
  paginate(
    @Body()
    query: PaginateQuery & { relations: ('rents' | 'office' | 'ratings')[] },
  ) {
    return this.paginateVehicleService.paginate(query);
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() dto: CreateVehicleDto) {
    const updateVehicle = Vehicle.fromDto(dto);
    return this.updateVehicleService.update(id, updateVehicle);
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.getVehicleService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.deleteVehicleService.delete(id);
  }
}
