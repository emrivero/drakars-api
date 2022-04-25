import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { MunicipalityEntity } from './municipality.entity';

@Entity()
export class CityEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  code: string;

  @Column()
  name: string;

  @OneToMany(() => MunicipalityEntity, (municipality) => municipality.city)
  municipalities?: MunicipalityEntity[];
}
