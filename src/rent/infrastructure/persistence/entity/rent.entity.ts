import { Column, Entity, Generated, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { PaymentStatus } from '../../../../invoice/domain/types/invoice-status';
import { PaymentType } from '../../../../invoice/domain/types/payment-type';
import { OfficeEntity } from '../../../../office/infrastructure/persistence/entity/office.entity';
import { ClientEntity } from '../../../../user/infrastructure/persistence/entity/client.entity';
import { VehicleEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle.entity';

@Entity()
export class RentEntity extends BaseEntity {
  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.rents)
  rentedVehicle: VehicleEntity;

  @ManyToOne(() => ClientEntity, (user) => user.rents)
  renterUser: ClientEntity;

  @ManyToOne(() => OfficeEntity)
  originOffice: OfficeEntity;

  @ManyToOne(() => OfficeEntity)
  destinyOffice: OfficeEntity;

  // @OneToOne(() => InvoiceEntity)
  // @JoinColumn()
  // invoice: InvoiceEntity;

  @Column({
    type: 'date',
  })
  startDate: string;

  @Column({
    type: 'date',
  })
  endDate: string;

  @Column()
  startHour: string;

  @Column()
  endHour: string;

  @Column({
    type: 'uuid',
    unique: true,
  })
  @Generated('uuid')
  reference?: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentType,
    nullable: true,
  })
  paymentType?: PaymentType;

  @Column({
    type: 'date',
    nullable: true,
  })
  paymentDate?: string;

  @Column({ type: 'float' })
  total: number;
}
