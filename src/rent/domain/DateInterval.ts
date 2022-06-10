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

  getDays() {
    const start = new DateModel(this.startDate);
    const end = new DateModel(this.endDate);
    return end.value.diff(start.value, 'day');
  }
}
