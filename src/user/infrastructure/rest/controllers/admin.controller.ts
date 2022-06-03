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
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticatedUser,
  AuthGuard,
  RoleGuard,
  RoleMatchingMode,
  Roles,
} from 'nest-keycloak-connect';
import { DeleteClientService } from '../../../../client/application/delete';
import {
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from '../../../../lib/paginate';
import { CancelRentService } from '../../../../rent/application/cancel-rent';
import { RentRepository } from '../../../../rent/infrastructure/persistence/repository/rent.repository';
import { PaginateVehicleService } from '../../../../vehicle/application/paginate';
import { VehicleEntity } from '../../../../vehicle/infrastructure/persistence/entities/vehicle.entity';
import { PaginateAdminService } from '../../../application/admin/PaginateAdminService';
import { CreateUserService } from '../../../application/CreateUserService';
import { DeleteUserService } from '../../../application/DeleteUserService';
import { PaginateRentService } from '../../../application/PaginateRentService';
import { RefreshStatusRentService } from '../../../application/RefreshStatusRentService';
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
    private readonly deleteClientService: DeleteClientService,
    private paginateService: PaginateAdminService,
    private paginateVehicleService: PaginateVehicleService,
    private paginateRentService: PaginateRentService,
    private readonly refreshService: RefreshStatusRentService,
    private readonly cancelRentService: CancelRentService,
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

        if (
          editor.office.id !== rent.originOffice.id &&
          editor.office.id !== rent.destinyOffice.id
        ) {
          throw new ConflictException();
        }
      }
    }
    return rent;
  }

  @Get('rent-by-reference/:reference')
  @Roles({ roles: [Role.ADMIN, Role.EDITOR], mode: RoleMatchingMode.ANY })
  async getRentByReference(
    @AuthenticatedUser() dto: AdminDto,
    @Param('reference') reference: string,
  ) {
    const rent = await this.rentRepository.getRentByReference(reference);
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

        if (
          editor.office.id !== rent.originOffice.id &&
          editor.office.id !== rent.destinyOffice.id
        ) {
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
    @AuthenticatedUser() dto: AdminDto,
    @Body()
    query: PaginateQuery,
  ) {
    return this.paginateService.paginateEditor(query, dto.email);
  }

  @Roles({ roles: [Role.ADMIN], mode: RoleMatchingMode.ANY })
  @Post('paginate/admin')
  paginateAdmins(
    @AuthenticatedUser() dto: AdminDto,
    @Body()
    query: PaginateQuery,
  ) {
    return this.paginateService.paginateAdmin(query, dto.email);
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
    const newQuery = await this.queryWithOffice(dto, query);
    return this.paginateVehicleService.paginate(newQuery);
  }

  @Roles({ roles: [Role.ADMIN, Role.EDITOR], mode: RoleMatchingMode.ANY })
  @Post('/rent/paginate')
  @HttpCode(200)
  async paginateRents(
    @AuthenticatedUser() dto: AdminDto,
    @Body()
    query: PaginateQuery,
  ) {
    const office = await this.getOfficeFromUser(dto);
    if (office) {
      return this.paginateRentService.paginate(query, office.id);
    }
    return this.paginateRentService.paginate(query);
  }

  @Roles({ roles: [Role.ADMIN, Role.EDITOR], mode: RoleMatchingMode.ANY })
  @Delete('/client/:id/:email')
  async deleteClient(@Param('id') id: string, @Param('email') email: string) {
    return this.deleteClientService.delete(id, email);
  }

  @Roles({ roles: [Role.ADMIN, Role.EDITOR], mode: RoleMatchingMode.ANY })
  @Post('/rent/refresh')
  async refreshStatusRents() {
    return this.refreshService.refresh();
  }

  @Roles({ roles: [Role.ADMIN, Role.EDITOR], mode: RoleMatchingMode.ANY })
  @Put('/rent/cancel/:reference')
  async cancelRent(@Param('reference') reference: string) {
    return this.cancelRentService.cancel(reference);
  }

  @Roles({ roles: [Role.ADMIN, Role.EDITOR], mode: RoleMatchingMode.ANY })
  @Put('rent/change-vehicle/:reference/:id')
  async changeVehicle(
    @Param('reference') reference: string,
    @Param('id') id: number,
  ) {
    const rent = await this.rentRepository.findOne({ reference });
    const newVehicle = new VehicleEntity();
    newVehicle.id = id;
    rent.rentedVehicle = newVehicle;
    return this.rentRepository.save(rent);
  }

  async getOfficeFromUser(dto: AdminDto) {
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
        return editor.office;
      }
    }
    return null;
  }

  private async queryWithOffice(
    dto: AdminDto,
    query: PaginateQuery & {
      relations: ('rents' | 'office' | 'ratings')[];
      paginateOptions: PaginateConfig<VehicleEntity>;
    },
  ) {
    const office = await this.getOfficeFromUser(dto);
    if (!office) {
      return query;
    }
    const newQuery: PaginateQuery & {
      relations: ('rents' | 'office' | 'ratings')[];
      paginateOptions: PaginateConfig<VehicleEntity>;
    } = {
      ...query,
      filter: {
        'office.id': `${office.id}`,
      },
    };
    return newQuery;
  }
}
