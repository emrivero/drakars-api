import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Municipality } from '../../../city/domain/models/municipality';
import { BaseModel } from '../../../common/domain/models/base';
import { OfficeEntity } from '../../infrastructure/persistence/entity/office.entity';
import { CreateOfficeDto } from '../../infrastructure/rest/dto/create-office.dto';

export class Office extends BaseModel {
  public municipality: Municipality = null;
  private constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    public name: string,
    public address: string,
    public zipCode: string,
    municipalityId: number = null,
  ) {
    super(id, createdAt, updatedAt);
    if (municipalityId) {
      this.municipality = Municipality.create(municipalityId);
    }
  }

  static create(id: number) {
    return new Office(id, null, null, null, null, null);
  }

  static fromDto(dto: CreateOfficeDto): Office {
    return new Office(
      null,
      null,
      null,
      dto.name,
      dto.address,
      dto.zipCode,
      dto.municipality,
    );
  }

  toEntity() {
    const plain = instanceToPlain(this);
    const entity = plainToInstance(OfficeEntity, plain);
    delete entity.createdAt;
    delete entity.updatedAt;
    delete entity.id;
    return entity;
  }
}
