import { Hour } from './hour';

describe('Hour model (unit)', () => {
  let hour1: Hour;
  let hour2: Hour;

  beforeAll(async () => {
    hour1 = new Hour('10:35');
    hour2 = new Hour('05:40');
  });

  it('10:35 is after 05:40', () => {
    expect(hour1.after(hour2)).toBe(true);
  });

  it('05:40 is before 10:35', () => {
    expect(hour2.before(hour1)).toBe(true);
  });

  it('10:35 is not before 05:40', () => {
    expect(hour1.before(hour2)).toBe(false);
  });

  it('05:40 is not after 10:35', () => {
    expect(hour2.after(hour1)).toBe(false);
  });

  it('Hour is not after of null', () => {
    expect(hour1.before(null)).toBe(false);
  });

  it('Hour is not before of null', () => {
    expect(hour1.before(null)).toBe(false);
  });

  it('Hour is not after of null value hour', () => {
    expect(hour1.before(new Hour(null))).toBe(false);
  });

  it('Hour is not before of null value hour', () => {
    expect(hour1.before(new Hour(null))).toBe(false);
  });

  it('Hour is not after of empty string value hour', () => {
    expect(hour1.before(new Hour(null))).toBe(false);
  });

  it('Hour is not before of empty string value hour', () => {
    expect(hour1.before(new Hour(null))).toBe(false);
  });

  it('Hour is not after of malformed hour [new Hour("25:00")]', () => {
    expect(hour1.before(new Hour('25:00'))).toBe(false);
  });

  it('Hour is not after of malformed hour [new Hour("2:30")]', () => {
    expect(hour1.before(new Hour('2:30'))).toBe(false);
  });

  it('Hour is not after of malformed hour [new Hour("05:60")]', () => {
    expect(hour1.before(new Hour('5:60'))).toBe(false);
  });

  it('Hour is not after of malformed hour [new Hour("05:1")]', () => {
    expect(hour1.before(new Hour('5:01'))).toBe(false);
  });
});
