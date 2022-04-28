import { BadRequestException, Injectable } from '@nestjs/common';
import { MunicipalityRepository } from '../../../city/infrastructure/persistence/repository/municipality.mariadb.repository';
import { Office } from '../../domain/models/office';
import { OfficeEntity } from '../../infrastructure/persistence/entity/office.entity';
import { OfficeRepository } from '../../infrastructure/persistence/repository/office.mariadb.repository';

@Injectable()
export class CreateOfficeService {
  constructor(
    private readonly officeRepository: OfficeRepository,
    private readonly municipalityRepository: MunicipalityRepository,
  ) {}

  async create(office: Office, municipalityId: number) {
    const municipalityEntity = await this.municipalityRepository.findOne(
      municipalityId,
    );
    if (!municipalityEntity) {
      throw new BadRequestException(
        `Office with id=${municipalityId} does not exist`,
      );
    }
    const entity = office.toEntity(OfficeEntity);
    return this.officeRepository.save(entity);
  }
}
