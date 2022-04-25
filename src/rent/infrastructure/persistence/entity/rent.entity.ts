import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { InvoiceEntity } from '../../../../invoice/infrastructure/persistence/entity/invoice.entity';
import { UserEntity } from '../../../../user/infrastructure/persistence/entity/user.entity';
import { VehicleEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle.entity';

@Entity()
export class RentEntity extends BaseEntity {
  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.rents)
  rentedVehicle: VehicleEntity;

  @ManyToOne(() => UserEntity, (user) => user.rents)
  renterUser: UserEntity;

  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.rent)
  invoice: InvoiceEntity;

  @Column({
    type: 'date',
  })
  startDate: Date;

  @Column({
    type: 'date',
  })
  endDate: Date;
}
