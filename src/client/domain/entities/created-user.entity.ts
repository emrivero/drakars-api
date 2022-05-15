// import { BaseEntity } from 'typeorm';
// import { Role } from '../types/role';

// export type CreatedUserProps = {
//   email_verified?: boolean;
//   email: string;
//   family_name: string;
//   given_name: string;
//   name: string;
//   password?: string;
//   preferred_username: string;
//   role: Role;
// };

// export class CreatedUser extends BaseEntity {
//   readonly email_verified: boolean;

//   readonly name: string;

//   readonly preferred_username: string;

//   readonly given_name: string;

//   readonly family_name: string;

//   readonly email: string;

//   readonly role: Role;

//   readonly password: string;

//   protected constructor(props: CreatedUserProps) {
//     this.email = props.email;
//     this.email_verified = props.email_verified;
//     this.family_name = props.family_name;
//     this.given_name = props.given_name;
//     this.preferred_username = props.preferred_username;
//     this.name = props.name;
//     this.role = props.role;
//     this.password = props.password;
//   }

//   static create(props: CreatedUserProps): CreatedUser {
//     return new CreatedUser(props);
//   }
// }
