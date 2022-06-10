import { BadRequestException, Injectable } from '@nestjs/common';
import { MunicipalityRepository } from '../../../city/infrastructure/persistence/repository/municipality.mariadb.repository';
import { Office } from '../../domain/models/office';
import { OfficeEntity } from '../../infrastructure/persistence/entity/office.entity';
import { OfficeRepository } from '../../infrastructure/persistence/repository/office.mariadb.repository';

@Injectable()
export class UpdateOfficeService {
  constructor(
    private readonly officeRepository: OfficeRepository,
    private readonly municipalityRepository: MunicipalityRepository,
  ) {}

  async update(id: number, office: Office) {
    const municipality = await this.municipalityRepository.findOne(
      office?.municipality?.id,
    );

    if (!municipality) {
      throw new BadRequestException(
        `Municipality with id=${office?.municipality?.id} does not exist`,
      );
    }

    const entity = office.toEntity(OfficeEntity);
    entity.id = id;
    return this.officeRepository.update(id, entity);
  }
}
