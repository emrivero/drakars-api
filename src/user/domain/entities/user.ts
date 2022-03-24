import { AutoMap } from '@automapper/classes';
import { AggregateRoot } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../events/user-creted.event';
import { UserDeletedEvent } from '../events/user-deleted.event';
import { UserUpdatedEvent } from '../events/user-updated.event';
import { Role } from '../types/role';

export class User extends AggregateRoot {
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
  password: string;

  @AutoMap()
  attributes?: Record<string, any>;

  create() {
    this.apply(new UserCreatedEvent(this.id));
  }

  delete() {
    this.apply(new UserDeletedEvent(this.id));
  }

  update() {
    this.apply(new UserUpdatedEvent(this.id));
  }
}
