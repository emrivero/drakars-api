import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { Role } from '../../../domain/types/role';

@Entity()
export abstract class UserEntity extends BaseEntity {
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

  @Column({
    default: false,
  })
  email_verified?: boolean;

  @Column({
    default: '',
  })
  preferred_username?: string;

  @Column({
    default: '',
  })
  given_name?: string;
}
