import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';

@Entity()
export class VehicleImageEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  url: string;
}
