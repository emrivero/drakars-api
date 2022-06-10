import { BaseModel } from '../../../common/domain/models/base';
import { EditorEntity } from '../../infrastructure/persistence/entity/editor.entity';
import { CreateEditorDto } from '../../infrastructure/rest/dtos/editor/create-editor-dto';
import { UserModel } from '../interface/user.model';
import { Role } from '../types/role';

export class Editor extends BaseModel<EditorEntity> implements UserModel {
  constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    public readonly name: string,
    public readonly family_name: string,
    public readonly email: string,
    public role: Role,
    public password: string,
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
  }

  static create(props: ConstructorParameters<typeof Editor>) {
    return new Editor(...props);
  }

  static fromDto(entity: CreateEditorDto) {
    return new Editor(
      null,
      null,
      null,
      entity.name,
      entity.family_name,
      entity.email,
      Role.EDITOR,
      '',
    );
  }
}
