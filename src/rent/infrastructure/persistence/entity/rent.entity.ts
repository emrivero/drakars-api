import { Column, Entity, Generated, ManyToOne } from 'typeorm';
import { ClientEntity } from '../../../../client/infrastructure/persistence/entity/client.entity';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { PaymentType } from '../../../../invoice/domain/types/payment-type';
import { OfficeEntity } from '../../../../office/infrastructure/persistence/entity/office.entity';
import { VehicleEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle.entity';
import { RentStatus } from '../../../domain/status';

@Entity()
export class RentEntity extends BaseEntity {
  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.rents, {
    onDelete: 'SET NULL',
  })
  rentedVehicle: VehicleEntity;

  @ManyToOne(() => ClientEntity, (user) => user.rents, {
    onDelete: 'SET NULL',
  })
  renterUser: ClientEntity;

  @ManyToOne(() => OfficeEntity)
  originOffice: OfficeEntity;

  @ManyToOne(() => OfficeEntity)
  destinyOffice: OfficeEntity;

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

  @Column({ default: 'pending' })
  status: RentStatus;
}
