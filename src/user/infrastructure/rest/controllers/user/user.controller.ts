import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  AuthenticatedUser,
  AuthGuard,
  RoleGuard,
  Roles,
} from 'nest-keycloak-connect';
import { DeleteUserCommand } from '../../../../application/commands/delete/delete-user.command';
import { UpdateUserCommand } from '../../../../application/commands/update/update-user.command';
import { FindAllUsersQuery } from '../../../../application/queries/find-all-users.query';
import { FindUserByIdQuery } from '../../../../application/queries/find-user-by-id.query';
import { User } from '../../../../domain/entities/user';
import { Role } from '../../../../domain/types/role';
import { UpdateUserDto } from '../../dtos/update-user-dto';
import { UserVm } from '../../vms/user.vm';
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectMapper() private mapper: Mapper,
  ) {}

  @Roles({ roles: [Role.ADMIN] })
  @Get()
  async findAll(): Promise<UserVm[]> {
    const users = await this.queryBus.execute(new FindAllUsersQuery());

    return this.mapper.mapArray(users, UserVm, User);
  }

  @Roles({ roles: [Role.ADMIN] })
  @Get('/:id')
  async findById(@Param('id') id: string): Promise<UserVm> {
    const user = await this.queryBus.execute(new FindUserByIdQuery(id));

    return this.mapper.map(user, UserVm, User);
  }

  @Post()
  async createUser(@AuthenticatedUser() user) {
    console.log(user);
  }

  @Roles({ roles: [Role.ADMIN] })
  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<UserVm> {
    const user = await this.commandBus.execute(new DeleteUserCommand(id));

    return this.mapper.map(user, UserVm, User);
  }

  @Roles({ roles: [Role.ADMIN] })
  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.commandBus.execute(new UpdateUserCommand(id, dto));

    return this.mapper.map(user, UserVm, User);
  }
}
