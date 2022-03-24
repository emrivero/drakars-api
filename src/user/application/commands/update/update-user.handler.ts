import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { User } from '../../../domain/entities/user';
import { IDPRepository } from '../../../domain/idp/idp.repository';
import { CreateUserDto } from '../../../infrastructure/rest/dtos/create-user.dto';
import { UpdateUserCommand } from './update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    private repository: IDPRepository,
    private publisher: EventPublisher,
    private eventBus: EventBus,
    @InjectMapper() private mapper: Mapper
  ) {}

  async execute(command: UpdateUserCommand) {
    const { id, dto } = command;
    let user: User = this.mapper.map(dto, User, CreateUserDto);
    user = this.publisher.mergeObjectContext(
      await this.repository.updateUser(id, user)
    );

    user.update();
    user.commit();

    return user;
  }
}
