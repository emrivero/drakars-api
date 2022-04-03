import { instanceToPlain, plainToInstance } from 'class-transformer';
import { VehicleEntity } from '../../infrastructure/persistence/entities/vehicle.entity';

export class Vehicle {
  constructor(
    readonly year: number,
    readonly model: string,
    readonly mark: string,
  ) {}

  toView() {
    return;
  }

  fromDto() {
    return;
  }

  toEntity() {
    const plain = instanceToPlain(this);

    return plainToInstance(VehicleEntity, plain);
  }

  fromEntity() {
    return;
  }
}
