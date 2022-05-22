import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateUserService } from '../../../application/CreateUserService';
import { DeleteUserService } from '../../../application/DeleteUserService';
import { CreateAdminDto } from '../dtos/admin/create-admin-dto';
import { CreateEditorDto } from '../dtos/editor/create-editor-dto';

@Controller('admin')
// @UseGuards(RoleGuard, AuthGuard)
// @Roles({ roles: [Role.ADMIN] })
export class AdminController {
  constructor(
    private createService: CreateUserService,
    private deleteService: DeleteUserService,
  ) {}
  @Post('create')
  createEditor(@Body() dto: CreateAdminDto) {
    return this.createService.createAdmin(dto);
  }

  @Post('editor/create')
  createAdmin(@Body() dto: CreateEditorDto) {
    return this.createService.createEditor(dto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.deleteService.deleteUser(id);
  }
}
