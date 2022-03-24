import { CreateUserDto } from '../../../infrastructure/rest/dtos/create-user.dto';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}
