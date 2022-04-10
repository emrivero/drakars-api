import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser, AuthGuard, RoleGuard } from 'nest-keycloak-connect';
import { CreateUserService } from '../../../../application/CreateUserService';
import { LoggedUserDto } from '../../dtos/logged-user.dto';
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly createUserService: CreateUserService) {}

  // @Roles({ roles: [Role.ADMIN] })
  // @Get()
  // async findAll(): Promise<UserVm[]> {
  //   const users = await this.queryBus.execute(new FindAllUsersQuery());

  //   return this.mapper.mapArray(users, UserVm, User);
  // }

  // @Roles({ roles: [Role.ADMIN] })
  // @Get('/:id')
  // async findById(@Param('id') id: string): Promise<UserVm> {
  //   const user = await this.queryBus.execute(new FindUserByIdQuery(id));

  //   return this.mapper.map(user, UserVm, User);
  // }

  @Post()
  async createUser(@AuthenticatedUser() user: LoggedUserDto) {
    this.createUserService.create(user);
  }

  // @Roles({ roles: [Role.ADMIN] })
  // @Delete('/:id')
  // async deleteUser(@Param('id') id: string): Promise<UserVm> {
  //   const user = await this.commandBus.execute(new DeleteUserCommand(id));

  //   return this.mapper.map(user, UserVm, User);
  // }

  // @Roles({ roles: [Role.ADMIN] })
  // @Patch('/:id')
  // async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
  //   const user = await this.commandBus.execute(new UpdateUserCommand(id, dto));

  //   return this.mapper.map(user, UserVm, User);
  // }
}
