import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'typeorm';
import { VehicleRepository } from '../../../domain/repository/vehicle.repository';
import { VehicleEntity } from '../entities/vehicle.entity';

@Injectable()
@EntityRepository(VehicleEntity)
export class VehicleMariadbRepository extends VehicleRepository {}
