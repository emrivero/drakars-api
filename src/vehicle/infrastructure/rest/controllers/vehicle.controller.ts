import { Controller, Get, Post } from '@nestjs/common';
import { CreateVehicleService } from '../../../application/create-vehicle';
import { Vehicle } from '../../../domain/models/vehicle';

@Controller('vehicle')
export class VehicleController {
  constructor(private createVehicleService: CreateVehicleService) {}

  @Post()
  create() {
    const model = new Vehicle(2010, 'Corsa', 'Opel');
    this.createVehicleService.create(model);
  }

  @Get()
  get() {
    return 'OK';
  }
}
