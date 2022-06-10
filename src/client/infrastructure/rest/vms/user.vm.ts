import { AutoMap } from '@automapper/classes';
import { Role } from '../../../domain/types/role';

export class UserVm {
  @AutoMap()
  id?: string;

  @AutoMap()
  createdTimestamp?: number;

  @AutoMap()
  username?: string;

  @AutoMap()
  enabled?: boolean;

  @AutoMap()
  totp?: boolean;

  @AutoMap()
  emailVerified?: boolean;

  @AutoMap()
  disableableCredentialTypes?: string[];

  @AutoMap()
  notBefore?: number;

  @AutoMap()
  clientRoles?: Record<string, any>;

  @AutoMap()
  email?: string;

  @AutoMap()
  firstName?: string;

  @AutoMap()
  groups?: string[];

  @AutoMap()
  lastName?: string;

  @AutoMap()
  origin?: string;

  @AutoMap()
  realmRoles?: string[];

  @AutoMap()
  self?: string;

  @AutoMap()
  serviceAccountClientId?: string;

  @AutoMap()
  role: Role;

  @AutoMap()
  attributes?: Record<string, any>;
}
