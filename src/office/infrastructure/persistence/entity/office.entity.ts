import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MunicipalityEntity } from '../../../../city/infrastructure/persistence/entity/municipality.entity';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { VehicleEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle.entity';

@Entity()
export class OfficeEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  zipCode: string;

  @ManyToOne(() => MunicipalityEntity, (municipality) => municipality.offices)
  municipality: MunicipalityEntity;

  @OneToMany(() => VehicleEntity, (vehicle) => vehicle.office)
  vehicles: VehicleEntity[];
}
