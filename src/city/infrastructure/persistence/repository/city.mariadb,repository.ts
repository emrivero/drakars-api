import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CityEntity } from '../entity/city.entity';

@Injectable()
@EntityRepository(CityEntity)
export class CityRepository extends Repository<CityEntity> {}
