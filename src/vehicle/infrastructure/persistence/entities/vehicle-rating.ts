import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { UserEntity } from '../../../../user/infrastructure/persistence/entity/user.entity';
import { RatingType } from '../../../domain/types/rating.type';
import { VehicleEntity } from './vehicle.entity';

@Entity()
export class VehicleRatingEntity extends BaseEntity {
  @Column({
    enum: RatingType,
    type: 'enum',
  })
  score: RatingType;

  @ManyToOne(() => UserEntity, (user) => user.ratings)
  user: UserEntity;

  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.ratings)
  vehicle: VehicleEntity;
}
