import { User } from '../entities/user';

export abstract class IDPRepository {
  abstract createUser(user: User): Promise<User>;
  abstract getUser(id: string): Promise<User>;
  abstract getUsers(): Promise<User[]>;
  abstract updateUser(id: string, user: User): Promise<User>;
  abstract deleteUser(id: string): Promise<User>;
}
