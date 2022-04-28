import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Role } from '../../../domain/types/role';
import { ClientEntity } from '../entity/client.entity';

@Injectable()
@EntityRepository(ClientEntity)
export class ClientRepository extends Repository<ClientEntity> {
  private queryBuilder: SelectQueryBuilder<ClientEntity>;

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
}
