import { UpdateUserDto } from '../../../infrastructure/rest/dtos/update-user-dto';

export class UpdateUserCommand {
  constructor(public id: string, public dto: UpdateUserDto) {}
}
