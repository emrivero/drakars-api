import { BaseModel } from '../../../common/domain/models/base';
import { AdminEntity } from '../../infrastructure/persistence/entity/admin.entity';
import { CreateAdminDto } from '../../infrastructure/rest/dtos/admin/create-admin-dto';
import { UserModel } from '../interface/user.model';
import { Role } from '../types/role';

export class Admin extends BaseModel<AdminEntity, string> implements UserModel {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    public readonly name: string,
    public readonly family_name: string,
    public readonly email: string,
    public role: Role,
    public password: string,
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
  }

  static create(props: ConstructorParameters<typeof Admin>) {
    return new Admin(...props);
  }

  static fromDto(entity: CreateAdminDto) {
    return new Admin(
      null,
      null,
      null,
      entity.name,
      entity.family_name,
      entity.email,
      Role.ADMIN,
      '',
    );
  }
}
