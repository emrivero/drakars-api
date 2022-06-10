import { Role } from '../../../../domain/types/role';

export class AdminDto {
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  sub: string;
  resource_access: {
    'drakars-admin-api': {
      roles: Role[];
    };
  };
}
