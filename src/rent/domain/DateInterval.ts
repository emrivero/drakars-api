import { DateModel } from './Date';

export class DateInterval {
  constructor(public startDate: string, public endDate: string) {}

  inRange(hour: string) {
    const hourInst = new DateModel(hour);
    return (
      new DateModel(this.startDate).before(hourInst) &&
      new DateModel(this.endDate).after(hourInst)
    );
  }

  isValid() {
    return new DateModel(this.startDate).before(new DateModel(this.endDate));
  }
}
