import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AdminEntity } from '../entity/admin.entity';

@Injectable()
@EntityRepository(AdminEntity)
export class AdminRepository extends Repository<AdminEntity> {}
