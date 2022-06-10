import { DateInterval } from './DateInterval';

describe('Hour model (unit)', () => {
  const interval = new DateInterval('2020-01-01', '2020-01-07');

  it('2020-01-01 a 2020-01-07 es valido', () => {
    expect(interval.isValid()).toBe(true);
  });

  it('Entre 2020-01-01 ay2020-01-07 hay 6 dias', () => {
    expect(interval.getDays()).toBe(6);
  });
});
