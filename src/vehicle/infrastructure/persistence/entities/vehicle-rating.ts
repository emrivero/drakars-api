import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { ClientEntity } from '../../../../user/infrastructure/persistence/entity/client.entity';
import { RatingType } from '../../../domain/types/rating.type';
import { VehicleEntity } from './vehicle.entity';

@Entity()
export class VehicleRatingEntity extends BaseEntity {
  @Column({
    enum: RatingType,
    type: 'enum',
  })
  score: RatingType;

  @ManyToOne(() => ClientEntity, (user) => user.ratings)
  user: ClientEntity;

  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.ratings)
  vehicle: VehicleEntity;
}
