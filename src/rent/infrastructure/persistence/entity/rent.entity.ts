import { Column, Entity, Generated, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { InvoiceStatus } from '../../../../invoice/domain/types/invoice-status';
import { PaymentType } from '../../../../invoice/domain/types/payment-type';
import { ClientEntity } from '../../../../user/infrastructure/persistence/entity/client.entity';
import { VehicleEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle.entity';

@Entity()
export class RentEntity extends BaseEntity {
  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.rents)
  rentedVehicle: VehicleEntity;

  @ManyToOne(() => ClientEntity, (user) => user.rents)
  renterUser: ClientEntity;

  // @OneToOne(() => InvoiceEntity)
  // @JoinColumn()
  // invoice: InvoiceEntity;

  @Column({
    type: 'date',
  })
  startDate: Date;

  @Column({
    type: 'date',
  })
  endDate: Date;

  @Column({
    type: 'uuid',
    unique: true,
  })
  @Generated('uuid')
  reference: string;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
  })
  status: InvoiceStatus;

  @Column({
    type: 'enum',
    enum: PaymentType,
  })
  paymentType: PaymentType;

  @Column({
    type: 'date',
  })
  paymentDate: Date;
}
