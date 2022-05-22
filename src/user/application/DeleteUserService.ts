import { Injectable } from '@nestjs/common';
import { KeycloakRepository } from '../infrastructure/idp/keycloak/repositories/keycloak.repository';
import { AdminRepository } from '../infrastructure/persistence/repository/admin.repository';
import { EditorRepository } from '../infrastructure/persistence/repository/editor.repository';

@Injectable()
export class DeleteUserService {
  constructor(
    private editorRepository: EditorRepository,
    private adminRepository: AdminRepository,
    private kcRepository: KeycloakRepository,
  ) {}

  async deleteUser(id: string) {
    await this.kcRepository.deleteUser(id);

    const editor = await this.editorRepository.findOne({ id });
    if (!editor) {
      const admin = await this.adminRepository.findOne({ id });
      await this.adminRepository.remove(admin);
      return admin;
    }
    await this.editorRepository.remove(editor);
    return editor;
  }
}
