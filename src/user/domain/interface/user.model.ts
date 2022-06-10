import { Role } from '../types/role';

export interface UserModel {
  name: string;
  family_name: string;
  email: string;
  role: Role;
  password: string;
}
