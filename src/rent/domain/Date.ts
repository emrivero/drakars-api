import * as moment from 'moment';

export class DateModel {
  public value: moment.Moment = null;

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

  equal(date: DateModel) {
    return this.value.format('DD-MM-YYYY') === date.value.format('DD-MM-YYYY');
  }
}
