import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticatedUser,
  AuthGuard,
  RoleGuard,
  Roles,
  Unprotected,
} from 'nest-keycloak-connect';
import { CreateUserService } from '../../../../application/CreateUserService';
import { DeleteUserService } from '../../../../application/DeleteUserService';
import { FindUserService } from '../../../../application/FindUserService';
import { UpdateUserService } from '../../../../application/UpdateUserService';
import { Role } from '../../../../domain/types/role';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { LoggedUserDto } from '../../dtos/logged-user.dto';
import { UpdateUserDto } from '../../dtos/update-user-dto';
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
@Unprotected()
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly findUserService: FindUserService,
    private readonly deleteUserService: DeleteUserService,
    private readonly updateUserService: UpdateUserService,
  ) {}

  @Get('/clients')
  async getClients() {
    return await this.findUserService.getByRole(Role.USER);
  }

  @Get('/editors')
  async getEditors() {
    return await this.findUserService.getByRole(Role.EDITOR);
  }

  @Get('/admins')
  async getAdmins() {
    return await this.findUserService.getByRole(Role.ADMIN);
  }

  @Get('/:id/:role')
  async getById(@Param('id') id: number, @Param('role') role: Role) {
    return await this.findUserService.getByIdAndRole(id, role);
  }

  @Roles({ roles: [Role.USER] })
  @Post()
  async createUser(@AuthenticatedUser() user: LoggedUserDto) {
    this.createUserService.create(user);
  }

  @Post('/editor')
  async createEditor(@Body() userDto: CreateUserDto) {
    if (![Role.ADMIN, Role.EDITOR].includes(userDto.role)) {
      throw new BadRequestException('User role not allowed');
    }
    this.createUserService.createEditor(userDto);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number) {
    return await this.deleteUserService.deleteUser(id);
  }

  @Delete()
  async deleteUsers(@Body() data: { ids: number[] }) {
    return await this.deleteUserService.deleteUsers(data.ids);
  }

  @Patch()
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.updateUserService.update(dto);
  }
}
