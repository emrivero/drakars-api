import { Entity, ManyToOne } from 'typeorm';
import { OfficeEntity } from '../../../../office/infrastructure/persistence/entity/office.entity';
import { UserEntity } from './user.entity';

@Entity()
export class EditorEntity extends UserEntity {
  @ManyToOne(() => OfficeEntity, (office) => office.editors)
  office: OfficeEntity;
}
