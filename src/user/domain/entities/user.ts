import { CreatedUser, CreatedUserProps } from './created-user.entity';

type UserProps = CreatedUserProps & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};
export class User extends CreatedUser {
  id: number;

  createdAt: Date;

  updatedAt: Date;

  private constructor(props: UserProps) {
    super(props);
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: UserProps): User {
    return new User(props);
  }
}
