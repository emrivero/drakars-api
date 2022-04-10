import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { Role } from '../../../domain/types/role';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  email_verified: boolean;

  @Column()
  name: string;

  @Column()
  preferred_username: string;

  @Column()
  given_name: string;

  @Column()
  family_name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  rol: Role;
}
