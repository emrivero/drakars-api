import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { OfficeRepository } from '../../office/infrastructure/persistence/repository/office.mariadb.repository';
import { Admin } from '../domain/entities/admin';
import { Editor } from '../domain/entities/editor';
import { KeycloakAdminRepository } from '../infrastructure/idp/keycloak/repositories/keycloak.repository';
import { AdminEntity } from '../infrastructure/persistence/entity/admin.entity';
import { EditorEntity } from '../infrastructure/persistence/entity/editor.entity';
import { AdminRepository } from '../infrastructure/persistence/repository/admin.repository';
import { EditorRepository } from '../infrastructure/persistence/repository/editor.repository';
import { CreateAdminDto } from '../infrastructure/rest/dtos/admin/create-admin-dto';
import { CreateEditorDto } from '../infrastructure/rest/dtos/editor/create-editor-dto';

@Injectable()
export class CreateUserService {
  constructor(
    private editorRepository: EditorRepository,
    private adminRepository: AdminRepository,
    private officeRepository: OfficeRepository,
    private kcRepository: KeycloakAdminRepository,
  ) {}

  async createAdmin(dto: CreateAdminDto) {
    const randomPassword = randomBytes(16).toString('base64url');
    const admin = Admin.fromDto(dto);
    admin.password = randomPassword;
    const entity = admin.toEntity(AdminEntity);

    const kcEntity = await this.kcRepository.createUser(admin);
    entity.id = kcEntity.id;
    await this.adminRepository.save(entity);

    return admin;
  }

  async createEditor(dto: CreateEditorDto) {
    const randomPassword = randomBytes(16).toString('base64url');
    const editor = Editor.fromDto(dto);
    editor.password = randomPassword;
    const entity = editor.toEntity(EditorEntity);

    const kcEntity = await this.kcRepository.createUser(editor);

    const office = await this.officeRepository.findOne(dto.officeId);
    entity.office = office;
    entity.id = kcEntity.id;
    await this.editorRepository.save(entity);

    return editor;
  }
}
