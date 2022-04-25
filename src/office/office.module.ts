import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficeEntity } from './infrastructure/persistence/entity/office.entity';
import { OfficeRepository } from './infrastructure/persistence/repository/office.mariadb.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OfficeEntity, OfficeRepository])],
})
export class OfficeModule {}
