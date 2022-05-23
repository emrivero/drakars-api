import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RentRepository } from '../../../../rent/infrastructure/persistence/repository/rent.repository';
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
    private rentRepository: RentRepository,
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

  @Get('rent/:searchValue')
  async getRent(@Param('searchValue') value: string) {
    const rent = await this.rentRepository.getRentAnyFilter(value);
    if (!rent) {
      throw new NotFoundException();
    }
    return rent;
  }

  @Patch('rent/checkIn/:id')
  checkInRent(@Param('id') id: number) {
    return this.rentRepository.checkIn(id);
  }

  @Patch('rent/checkOut/:id')
  checkOutRent(@Param('id') id: number) {
    return this.rentRepository.checkOut(id);
  }
}
