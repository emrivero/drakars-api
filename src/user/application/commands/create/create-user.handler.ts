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
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    private repository: IDPRepository,
    private publisher: EventPublisher,
    private eventBus: EventBus,
    @InjectMapper() private mapper: Mapper
  ) {}

  async execute(command: CreateUserCommand) {
    let user: User = this.mapper.map(command.dto, User, CreateUserDto);
    user = this.publisher.mergeObjectContext(
      await this.repository.createUser(user)
    );

    user.create();
    user.commit();

    return user;
  }
}
