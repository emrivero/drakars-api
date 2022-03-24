import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../../domain/entities/user';
import { IDPRepository } from '../../domain/idp/idp.repository';
import { FindUserByIdQuery } from './find-user-by-id.query';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler
  implements IQueryHandler<FindUserByIdQuery>
{
  constructor(private repository: IDPRepository) {}

  async execute(query: FindUserByIdQuery): Promise<User> {
    const { id } = query;
    const data = await this.repository.getUser(id);

    return data;
  }
}
