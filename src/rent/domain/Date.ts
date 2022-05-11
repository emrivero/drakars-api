import * as moment from 'moment';

export class DateModel {
  private value: moment.Moment = null;

  constructor(value) {
    if (moment(value).isValid()) {
      this.value = moment(value);
    }
  }

  before(date: DateModel) {
    return this.value.isBefore(date.value);
  }

  after(date: DateModel) {
    return this.value.isAfter(date.value);
  }
}
