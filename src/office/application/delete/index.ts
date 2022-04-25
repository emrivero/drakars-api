import { Injectable } from '@nestjs/common';
import { OfficeRepository } from '../../infrastructure/persistence/repository/office.mariadb.repository';

@Injectable()
export class DeleteOfficeService {
  constructor(private readonly officeRepository: OfficeRepository) {}
}
