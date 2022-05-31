import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { VehicleImageEntity } from '../entities/vehicle-image';

@Injectable()
@EntityRepository(VehicleImageEntity)
export class VehicleImageRepository extends Repository<VehicleImageEntity> {
  uploadImage(name: string, type: string) {
    const entity = this.create({
      name,
      url: `/static/vehicles/${name}.${type}`,
    });

    return this.save(entity);
  }

  async getName(name: string) {
    const entity = await this.findOne({ name });
    const url = entity.url;
    const nameWithType = url.split('/').filter((v) => v.length > 0)[2];
    return nameWithType;
  }
}
