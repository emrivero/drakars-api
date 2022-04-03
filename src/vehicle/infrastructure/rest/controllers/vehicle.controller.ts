import { Controller, Post } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { CreateVehicleService } from '../../../application/create-vehicle';
import { Vehicle } from '../../../domain/models/vehicle';

@Controller('vehicle')
export class VehicleController {
  constructor(private createVehicleService: CreateVehicleService) {}

  @Post()
  @Unprotected()
  create() {
    const model = new Vehicle(2010, 'Corsa', 'Opel');
    this.createVehicleService.create(model);
  }
}
