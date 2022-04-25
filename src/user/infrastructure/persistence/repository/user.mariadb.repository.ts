import { Injectable } from '@nestjs/common';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { UserRepository } from '../../../domain/interface/user.repository';
import { Role } from '../../../domain/types/role';
import { UserEntity } from '../entity/user.entity';

@Injectable()
@EntityRepository(UserEntity)
export class UserMariadbRepository extends UserRepository {
  private queryBuilder: SelectQueryBuilder<UserEntity>;

  private getQueryBuilder() {
    if (!this.queryBuilder) {
      this.queryBuilder = this.createQueryBuilder('user');
    }
    return this.queryBuilder;
  }

  async findOneBy(field: string, value: any) {
    return await this.getQueryBuilder()
      .where(`user.${field}=:${field}`, { [field]: value })
      .getOne();
  }

  async findByRole(role: Role) {
    return await this.getQueryBuilder()
      .where(`user.role=:role`, { role })
      .getMany();
  }

  async findOneByRoleAndId(id: number, role: Role) {
    return await this.getQueryBuilder()
      .where('user.role=:role', { role })
      .andWhereInIds([id])
      .getOne();
  }

  // async deleteByIds(ids: number[]) {
  //   return await this.manager.delete();
  // }
}
