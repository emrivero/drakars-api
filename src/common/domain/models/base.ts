import { instanceToPlain, plainToInstance } from 'class-transformer';
import { AbstractEntity } from '../../infrastructure/entities/abstract-entity';

export abstract class BaseModel<T extends AbstractEntity, ID = number> {
  constructor(
    public id: ID,
    public createdAt: Date = null,
    public updatedAt: Date = null,
  ) {}

  toEntity(construct: new () => T): T {
    const plain = instanceToPlain(this);
    const entity = plainToInstance(construct, plain);
    delete entity.createdAt;
    delete entity.updatedAt;
    return entity;
  }
}
