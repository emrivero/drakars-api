import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipalityRepository } from '../city/infrastructure/persistence/repository/municipality.mariadb.repository';
import { CreateOfficeService } from './application/create';
import { DeleteOfficeService } from './application/delete';
import { GetOfficeService } from './application/get-by-id';
import { PaginateOfficeService } from './application/paginate';
import { UpdateOfficeService } from './application/update';
import { OfficeEntity } from './infrastructure/persistence/entity/office.entity';
import { OfficeRepository } from './infrastructure/persistence/repository/office.mariadb.repository';
import { OfficeController } from './infrastructure/rest/controller/office.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OfficeEntity,
      OfficeRepository,
      MunicipalityRepository,
    ]),
  ],
  controllers: [OfficeController],
  providers: [
    CreateOfficeService,
    DeleteOfficeService,
    GetOfficeService,
    PaginateOfficeService,
    UpdateOfficeService,
  ],
})
export class OfficeModule {}
