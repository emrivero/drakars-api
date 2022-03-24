import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { IDPRepository } from '../../../domain/idp/idp.repository';
import { DeleteUserCommand } from './delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand>
{
  constructor(
    private repository: IDPRepository,
    private publisher: EventPublisher,
    private eventBus: EventBus,
    @InjectMapper() private mapper: Mapper
  ) {}

  async execute(command: DeleteUserCommand) {
    const { id } = command;
    let user = await this.repository.getUser(id);
    if (user) {
      user = this.publisher.mergeObjectContext(user);

      user.delete();
      user.commit();
    }

    return await this.repository.deleteUser(id);
  }
}
