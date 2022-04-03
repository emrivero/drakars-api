import { Repository } from 'typeorm';
import { VehicleEntity } from '../../infrastructure/persistence/entities/vehicle.entity';

export abstract class VehicleRepository extends Repository<VehicleEntity> {}
