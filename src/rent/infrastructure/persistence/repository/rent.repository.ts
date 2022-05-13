import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { RentEntity } from '../entity/rent.entity';

@Injectable()
@EntityRepository(RentEntity)
export class RentRepository extends Repository<RentEntity> {}
