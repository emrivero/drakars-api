export class Municipality {
  constructor(
    public id: number,
    public code: string,
    public city_code: string,
    public name: string,
  ) {}

  static create(id: number) {
    return new Municipality(id, null, null, null);
  }
}
