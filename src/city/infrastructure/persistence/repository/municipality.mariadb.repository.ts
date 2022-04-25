import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { MunicipalityEntity } from '../entity/municipality.entity';

@Injectable()
@EntityRepository(MunicipalityEntity)
export class MunicipalityRepository extends Repository<MunicipalityEntity> {}
