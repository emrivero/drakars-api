export abstract class BaseModel {
  constructor(
    public id: number,
    public createdAt: Date = null,
    public updatedAt: Date = null,
  ) {}
}
