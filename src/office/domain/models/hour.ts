import * as moment from 'moment';

export class Hour {
  private value: moment.Moment = null;

  constructor(value: string) {
    if (value && /([0-1][0-9]|2[0-3]):[0-5][0-9]/.test(value)) {
      const [hour, minutes] = value.split(':');
      this.value = moment().hour(parseInt(hour)).minutes(parseInt(minutes));
    }
  }

  after(hour: Hour) {
    if (!this.value || !hour || !hour.value) {
      return false;
    }

    const current = moment().hour(this.hour).minute(this.minute);
    const other = moment().hour(hour.hour).minute(hour.minute);

    return current.isSameOrAfter(other);
  }

  before(hour: Hour) {
    if (!this.value || !hour || !hour.value) {
      return false;
    }

    const current = moment().hour(this.hour).minute(this.minute);
    const other = moment().hour(hour.hour).minute(hour.minute);

    return current.isSameOrBefore(other);
  }

  get hour() {
    return this.value.hour();
  }

  get minute() {
    return this.value.minute();
  }
}
