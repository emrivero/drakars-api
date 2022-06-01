import { Column, Entity, OneToMany } from 'typeorm';
import { RentEntity } from '../../../../rent/infrastructure/persistence/entity/rent.entity';
import { UserEntity } from '../../../../user/infrastructure/persistence/entity/user.entity';
import { VehicleRatingEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle-rating';

@Entity()
export class ClientEntity extends UserEntity {
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
