import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { OfficeEntity } from '../../../../office/infrastructure/persistence/entity/office.entity';
import { CityEntity } from './city.entity';

@Entity()
export class MunicipalityEntity extends BaseEntity {
  @Column()
  code: string;

  @Column()
  city_code: string;

  @Column()
  name: string;

  @ManyToOne(() => CityEntity, (city) => city.municipalities)
  city: CityEntity;

  @OneToMany(() => OfficeEntity, (office) => office.municipality)
  offices: OfficeEntity[];
}
