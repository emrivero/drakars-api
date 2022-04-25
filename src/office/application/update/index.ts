import { Injectable } from '@nestjs/common';
import { OfficeRepository } from '../../infrastructure/persistence/repository/office.mariadb.repository';

@Injectable()
export class UpdateOfficeService {
  constructor(private readonly officeRepository: OfficeRepository) {}
}
