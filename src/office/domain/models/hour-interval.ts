import { Hour } from './hour';

export class HourInterval {
  constructor(public openingHour: string, public endingHour: string) {}

  inRange(hour: string) {
    const hourInst = new Hour(hour);
    return (
      new Hour(this.openingHour).before(hourInst) &&
      new Hour(this.endingHour).after(hourInst)
    );
  }

  isValid() {
    return new Hour(this.openingHour).before(new Hour(this.endingHour));
  }
}
