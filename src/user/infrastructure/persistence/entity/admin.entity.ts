import { Entity } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class AdminEntity extends UserEntity {}
