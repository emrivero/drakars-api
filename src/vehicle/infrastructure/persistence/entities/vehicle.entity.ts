import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { OfficeEntity } from '../../../../office/infrastructure/persistence/entity/office.entity';
import { RentEntity } from '../../../../rent/infrastructure/persistence/entity/rent.entity';
import { MarkType } from '../../../domain/types/mark.type';
import { TransmissionType } from '../../../domain/types/transmission';
import { VehicleType } from '../../../domain/types/vehicle.type';
import { VehicleRatingEntity } from './vehicle-rating';

@Entity()
export class VehicleEntity extends BaseEntity {
  @Column({
    type: 'year',
  })
  year: number;

  @Column()
  model: string;

  @Column({
    type: 'enum',
    enum: MarkType,
  })
  mark: MarkType;

  @Column()
  seats: number;

  @Column({
    type: 'enum',
    enum: TransmissionType,
  })
  transmission: TransmissionType;

  @Column({
    type: 'enum',
    enum: VehicleType,
  })
  type: VehicleType;

  @Column({
    nullable: true,
  })
  limitKM: number;

  @Column({ type: 'float' })
  pricePerDay: number;

  @Column({ type: 'int' })
  doors: number;

  @Column()
  fuel: string;

  @Column()
  fullName: string;

  @OneToMany(() => RentEntity, (rent) => rent.rentedVehicle, {
    onDelete: 'SET NULL',
  })
  rents: RentEntity[];

  @ManyToOne(() => OfficeEntity, (office) => office.vehicles, {
    nullable: false,
  })
  office: OfficeEntity;

  @OneToMany(() => VehicleRatingEntity, (rating) => rating.vehicle, {
    onDelete: 'SET NULL',
  })
  ratings: VehicleRatingEntity[];
}
