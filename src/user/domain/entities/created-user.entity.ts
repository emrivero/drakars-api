import { AggregateRoot } from '@nestjs/cqrs';
import { Role } from '../types/role';

export type CreatedUserProps = {
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  role: Role;
};

export class CreatedUser extends AggregateRoot {
  readonly email_verified: boolean;

  readonly name: string;

  readonly preferred_username: string;

  readonly given_name: string;

  readonly family_name: string;

  readonly email: string;

  readonly role: Role;

  protected constructor(props: CreatedUserProps) {
    super();
    this.email = props.email;
    this.email_verified = props.email_verified;
    this.family_name = props.family_name;
    this.given_name = props.given_name;
    this.preferred_username = props.preferred_username;
    this.name = props.name;
    this.role = props.role;
  }

  static create(props: CreatedUserProps): CreatedUser {
    return new CreatedUser(props);
  }
}
