import { Repository } from 'typeorm';
import { UserEntity } from '../../infrastructure/persistence/entity/user.entity';

export abstract class UserRepository extends Repository<UserEntity> {}
