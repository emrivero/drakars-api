import { BaseModel } from '../../../common/domain/models/base';
import { UserEntity } from '../../infrastructure/persistence/entity/user.entity';
import { Role } from '../types/role';

export abstract class User extends BaseModel<UserEntity> {
  public email_verified: boolean;
  protected constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    public name: string,
    public preferred_username: string,
    public given_name: string,
    public family_name: string,
    public email: string,
    public role: Role,
    public password: string,
  ) {
    super(id, createdAt, updatedAt);
  }
}
