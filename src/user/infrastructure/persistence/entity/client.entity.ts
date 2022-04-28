import { Entity, OneToMany } from 'typeorm';
import { RentEntity } from '../../../../rent/infrastructure/persistence/entity/rent.entity';
import { VehicleRatingEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle-rating';
import { UserEntity } from './user.entity';

@Entity()
export class ClientEntity extends UserEntity {
  @OneToMany(() => RentEntity, (rent) => rent.renterUser)
  rents: RentEntity[];

  @OneToMany(() => VehicleRatingEntity, (rating) => rating.user)
  ratings: VehicleRatingEntity[];
}
