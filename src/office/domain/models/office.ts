export class Office {
  constructor(
    public id: number,
    public name: string,
    public address: string,
    public zipCode: string,
  ) {}

  static create(id: number) {
    return new Office(id, null, null, null);
  }
}
