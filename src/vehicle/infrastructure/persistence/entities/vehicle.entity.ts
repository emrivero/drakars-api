import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';

@Entity()
export class VehicleEntity extends BaseEntity {
  @Column()
  year: number;

  @Column()
  model: string;

  @Column()
  mark: string;
}
