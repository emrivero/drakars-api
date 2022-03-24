import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../../domain/entities/user';
import { IDPRepository } from '../../domain/idp/idp.repository';
import { FindAllUsersQuery } from './find-all-users.query';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersQueryHandler
  implements IQueryHandler<FindAllUsersQuery>
{
  constructor(private repository: IDPRepository) {}

  async execute(): Promise<User[]> {
    const data = await this.repository.getUsers();

    return data;
  }
}
