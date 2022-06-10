import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { RatingType } from '../../../domain/types/rating.type';

@Entity()
export class VehicleRatingEntity extends BaseEntity {
  @Column({
    enum: RatingType,
    type: 'enum',
  })
  score: RatingType;
}
