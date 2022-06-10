import { AutoMap } from '@automapper/classes';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

export class UserKeycloakEntity implements UserRepresentation {
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
  attributes?: Record<string, any>;
}
