import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticatedUser,
  AuthGuard,
  RoleGuard,
  RoleMatchingMode,
  Roles,
} from 'nest-keycloak-connect';
import {
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from '../../../../lib/paginate';
import { RentRepository } from '../../../../rent/infrastructure/persistence/repository/rent.repository';
import { PaginateVehicleService } from '../../../../vehicle/application/paginate';
import { VehicleEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle.entity';
import { PaginateAdminService } from '../../../application/admin/PaginateAdminService';
import { CreateUserService } from '../../../application/CreateUserService';
import { DeleteUserService } from '../../../application/DeleteUserService';
import { Role } from '../../../domain/types/role';
import { EditorRepository } from '../../persistence/repository/editor.repository';
import { AdminDto } from '../dtos/admin/admin-dto';
import { CreateAdminDto } from '../dtos/admin/create-admin-dto';
import { CreateEditorDto } from '../dtos/editor/create-editor-dto';

@UseGuards(AuthGuard, RoleGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private createService: CreateUserService,
    private deleteService: DeleteUserService,
    private rentRepository: RentRepository,
    private editorRepository: EditorRepository,
    private paginateService: PaginateAdminService,
    private paginateVehicleService: PaginateVehicleService,
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
  @Roles({ roles: [Role.ADMIN, Role.EDITOR], mode: RoleMatchingMode.ANY })
  async getRent(
    @AuthenticatedUser() dto: AdminDto,
    @Param('searchValue') value: string,
  ) {
    const rent = await this.rentRepository.getRentAnyFilter(value);
    if (!rent) {
      throw new NotFoundException();
    }
    const { resource_access, sub } = dto;
    if (resource_access) {
      const roles = resource_access['drakars-admin-api']?.roles;
      if (roles.includes(Role.EDITOR)) {
        const editor = await this.editorRepository.findOne({
          where: {
            id: sub,
          },
          relations: ['office'],
        });

        if (editor.office.id !== rent.originOffice.id) {
          throw new ConflictException();
        }
      }
    }
    return rent;
  }

  @Roles({ roles: [Role.ADMIN, Role.EDITOR], mode: RoleMatchingMode.ANY })
  @Patch('rent/checkIn/:id')
  checkInRent(@Param('id') id: number) {
    return this.rentRepository.checkIn(id);
  }

  @Roles({ roles: [Role.ADMIN, Role.EDITOR], mode: RoleMatchingMode.ANY })
  @Patch('rent/checkOut/:id')
  checkOutRent(@Param('id') id: number) {
    return this.rentRepository.checkOut(id);
  }

  @Roles({ roles: [Role.ADMIN], mode: RoleMatchingMode.ANY })
  @Post('paginate/editor')
  paginateEditor(
    @Body()
    query: PaginateQuery,
  ) {
    return this.paginateService.paginateEditor(query);
  }

  @Roles({ roles: [Role.ADMIN], mode: RoleMatchingMode.ANY })
  @Post('paginate/admin')
  paginateAdmins(
    @Body()
    query: PaginateQuery,
  ) {
    return this.paginateService.paginateAdmin(query);
  }

  @Roles({ roles: [Role.ADMIN, Role.EDITOR], mode: RoleMatchingMode.ANY })
  @Post('paginate/client')
  paginateClients(
    @Body()
    query: PaginateQuery,
  ) {
    return this.paginateService.paginateClient(query);
  }

  @Roles({ roles: [Role.ADMIN, Role.EDITOR], mode: RoleMatchingMode.ANY })
  @Post('/vehicle/paginate')
  @HttpCode(200)
  async paginate(
    @AuthenticatedUser() dto: AdminDto,
    @Body()
    query: PaginateQuery & {
      relations: ('rents' | 'office' | 'ratings')[];
      paginateOptions: PaginateConfig<VehicleEntity>;
    },
  ): Promise<Paginated<VehicleEntity>> {
    const realm = dto?.resource_access['drakars-admin-api'];
    const roles = realm?.roles;
    if (roles && roles.length > 0) {
      if (roles[0] === Role.EDITOR) {
        const editor = await this.editorRepository.findOne(
          {
            id: dto.sub,
          },
          {
            relations: ['office'],
          },
        );
        const office = editor.office;
        if (!office) {
          return {
            data: [],
            meta: {
              currentPage: 0,
              itemsPerPage: 0,
              totalPages: 0,
              totalItems: 0,
              search: '',
              searchBy: ['id'],
              sortBy: [['id', 'ASC']],
            },
            links: { current: '' },
          };
        }
        const newQuery: PaginateQuery & {
          relations: ('rents' | 'office' | 'ratings')[];
          paginateOptions: PaginateConfig<VehicleEntity>;
        } = {
          ...query,
          filter: {
            'office.id': `${office.id}`,
          },
          relations: ['office'],
        };
        return this.paginateVehicleService.paginate(newQuery);
      }
    }
    return this.paginateVehicleService.paginate(query);
  }
}
