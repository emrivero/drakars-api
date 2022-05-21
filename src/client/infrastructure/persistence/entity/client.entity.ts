import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { RentEntity } from '../../../../rent/infrastructure/persistence/entity/rent.entity';
import { VehicleRatingEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle-rating';
import { Role } from '../../../domain/types/role';

@Entity()
export class ClientEntity extends BaseEntity {
  @Column({
    nullable: true,
  })
  dni: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column()
  name: string;

  @Column()
  family_name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    nullable: true,
  })
  role?: Role;

  @OneToMany(() => RentEntity, (rent) => rent.renterUser, {
    onDelete: 'SET NULL',
  })
  rents: RentEntity[];

  @OneToMany(() => VehicleRatingEntity, (rating) => rating.user, {
    onDelete: 'SET NULL',
  })
  ratings: VehicleRatingEntity[];

  @Column({
    type: 'enum',
    enum: ['anonymous', 'registered'],
    default: 'anonymous',
  })
  type: 'anonymous' | 'registered';
}
