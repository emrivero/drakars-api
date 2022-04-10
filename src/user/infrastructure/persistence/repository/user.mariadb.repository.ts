import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'typeorm';
import { UserRepository } from '../../../domain/interface/user.repository';
import { UserEntity } from '../entity/user.entity';

@Injectable()
@EntityRepository(UserEntity)
export class UserMariadbRepository extends UserRepository {
  async findBy(field: string, value: any) {
    const queryBuilder = await this.createQueryBuilder('user');
    return await queryBuilder
      .where(`user.${field}=:${field}`, { [field]: value })
      .getOne();
  }
}
