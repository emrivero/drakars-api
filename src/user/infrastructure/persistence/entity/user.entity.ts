import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../common/infrastructure/entities/base-entity';
import { RentEntity } from '../../../../rent/infrastructure/persistence/entity/rent.entity';
import { VehicleRatingEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle-rating';
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
  role: Role;

  @Column({
    type: 'blob',
    nullable: true,
  })
  profileImage: string;

  @OneToMany(() => RentEntity, (rent) => rent.renterUser)
  rents: RentEntity[];

  @OneToMany(() => VehicleRatingEntity, (rating) => rating.user)
  ratings: VehicleRatingEntity[];

  //TODO: EDITOR AND ADMIN RELATE TO OFFICE
}
