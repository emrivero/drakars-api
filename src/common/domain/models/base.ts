import { instanceToPlain, plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../infrastructure/entities/base-entity';

export abstract class BaseModel<T extends BaseEntity> {
  constructor(
    public id: number,
    public createdAt: Date = null,
    public updatedAt: Date = null,
  ) {}

  toEntity(construct: new () => T): T {
    const plain = instanceToPlain(this);
    const entity = plainToInstance(construct, plain);
    delete entity.createdAt;
    delete entity.updatedAt;
    delete entity.id;
    return entity;
  }
}
