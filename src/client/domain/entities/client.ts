import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { BaseModel } from '../../../common/domain/models/base';
import { ClientEntity } from '../../infrastructure/persistence/entity/client.entity';
import { Role } from '../types/role';

export class Client extends BaseModel<ClientEntity> {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    public readonly name: string,
    public readonly family_name: string,
    public readonly email: string,
    public readonly dni: string,
    public readonly phone: string,
    public role: Role,
    public type: 'anonymous' | 'registered' = 'anonymous',
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
  }

  static create(props: ConstructorParameters<typeof Client>) {
    return new Client(...props);
  }

  static fromKCEntity(entity: UserRepresentation) {
    return new Client(
      entity.id,
      null,
      null,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.attributes?.dni,
      entity.attributes?.phone,
      Role.CLIENT,
    );
  }
}
