import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from '../../../../common/infrastructure/entities/abstract-entity';
import { Role } from '../../../domain/types/role';

@Entity()
export abstract class UserEntity extends AbstractEntity {
  @PrimaryColumn({
    type: 'uuid',
  })
  id: string;

  @Column()
  name: string;

  @Column()
  family_name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    nullable: true,
  })
  role?: Role;

  @Column({
    type: 'blob',
    nullable: true,
  })
  profileImage?: string;
}
