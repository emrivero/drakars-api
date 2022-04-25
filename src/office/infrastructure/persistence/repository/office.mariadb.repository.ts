import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { OfficeEntity } from '../entity/office.entity';

@Injectable()
@EntityRepository(OfficeEntity)
export class OfficeRepository extends Repository<OfficeEntity> {}
