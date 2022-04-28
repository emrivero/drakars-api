import { BaseModel } from '../../../common/domain/models/base';
import { Office } from '../../../office/domain/models/office';
import { VehicleEntity } from '../../infrastructure/persistence/entities/vehicle.entity';
import { CreateVehicleDto } from '../../infrastructure/rest/dtos/create-vehicle';
import { MarkType } from '../types/mark.type';
import { TransmissionType } from '../types/transmission';
import { VehicleType } from '../types/vehicle.type';

export class Vehicle extends BaseModel<VehicleEntity> {
  public office: Office;

  private constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    public year: number,
    public model: string,
    public mark: MarkType,
    public seats: number,
    public limitKM: number,
    public pricePerDay: number,
    officeId: number,
    public transmission: TransmissionType,
    public type: VehicleType,
    public rented = false,
  ) {
    super(id, createdAt, updatedAt);
    this.office = Office.create(officeId);
  }

  toView() {
    return;
  }

  static fromDto(dto: Partial<CreateVehicleDto>): Vehicle {
    return new Vehicle(
      null,
      null,
      null,
      dto.year,
      dto.model,
      dto.mark,
      dto.seats,
      dto.limitKM,
      dto.pricePerDay,
      dto.office,
      dto.transmission,
      dto.type,
      dto.rented,
    );
  }

  fromEntity() {
    return;
  }
}
