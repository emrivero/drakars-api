import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './abstract-entity';

@Entity()
export abstract class BaseEntity extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;
}
