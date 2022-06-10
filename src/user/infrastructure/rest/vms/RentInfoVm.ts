import * as moment from 'moment';
import { DateModel } from '../../../../rent/domain/Date';
import { RentEntity } from '../../../../rent/infrastructure/persistence/entity/rent.entity';

export class RentInfoVm extends RentEntity {
  public modifiable: boolean;
  constructor(entity: RentEntity, editorOffice: number, delayed: boolean) {
    super();
    this.rentedVehicle = entity.rentedVehicle;
    this.renterUser = entity.renterUser;
    this.originOffice = entity.originOffice;
    this.destinyOffice = entity.destinyOffice;
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.startHour = entity.startHour;
    this.endHour = entity.endHour;
    this.reference = entity.reference;
    this.paymentType = entity.paymentType;
    this.paymentDate = entity.paymentDate;
    this.total = entity.total;
    this.status = entity.status;
    this.modifiable = false;

    if (this.status === 'pending' && this.originOffice.id === editorOffice) {
      const start = new DateModel(this.startDate);
      const now = moment().add(2, 'h');
      const nowDate = new DateModel(now);
      if (start.equal(nowDate)) {
        this.modifiable = true;
      }
    }

    if (
      ['checkedin', 'delayed'].includes(this.status) &&
      this.destinyOffice.id === editorOffice
    ) {
      this.modifiable = true;
    }

    if (delayed) {
      this.modifiable = false;
    }
  }
}
