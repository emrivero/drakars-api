import { IsInt, IsPositive } from 'class-validator';
import { CreateUserDto } from '../user/create-user-dto';

export class CreateEditorDto extends CreateUserDto {
  @IsPositive()
  @IsInt()
  officeId: number;
}
