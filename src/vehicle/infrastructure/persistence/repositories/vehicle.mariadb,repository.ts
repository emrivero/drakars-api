import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { VehicleEntity } from '../entities/vehicle.entity';

@Injectable()
@EntityRepository(VehicleEntity)
export class VehicleMariadbRepository extends Repository<VehicleEntity> {}
