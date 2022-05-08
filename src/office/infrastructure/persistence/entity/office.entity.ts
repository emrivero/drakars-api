import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MunicipalityEntity } from '../../../../city/infrastructure/persistence/entity/municipality.entity';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { EditorEntity } from '../../../../user/infrastructure/persistence/entity/editor.entity';
import { VehicleEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle.entity';

@Entity()
export class OfficeEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  zipCode: string;

  @Column()
  morningOpeningTime: string;

  @Column()
  morningClosingTime: string;

  @Column()
  eveningOpeningTime: string;

  @Column()
  eveningClosingTime: string;

  @ManyToOne(() => MunicipalityEntity, (municipality) => municipality.offices)
  municipality: MunicipalityEntity;

  @OneToMany(() => VehicleEntity, (vehicle) => vehicle.office, {
    onDelete: 'SET NULL',
  })
  vehicles: VehicleEntity[];

  @OneToMany(() => EditorEntity, (editor) => editor.office, {
    onDelete: 'SET NULL',
  })
  editors: EditorEntity;
}
