import { Column, Entity, OneToMany } from 'typeorm';
import { RentEntity } from '../../../../rent/infrastructure/persistence/entity/rent.entity';
import { VehicleRatingEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle-rating';
import { UserEntity } from './user.entity';

@Entity()
export class ClientEntity extends UserEntity {
  @Column()
  dni: string;

  @OneToMany(() => RentEntity, (rent) => rent.renterUser, {
    onDelete: 'SET NULL',
  })
  rents: RentEntity[];

  @OneToMany(() => VehicleRatingEntity, (rating) => rating.user, {
    onDelete: 'SET NULL',
  })
  ratings: VehicleRatingEntity[];
}
