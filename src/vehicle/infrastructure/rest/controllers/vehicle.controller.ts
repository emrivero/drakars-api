import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  Unprotected,
} from 'nest-keycloak-connect';
import { PaginateConfig, PaginateQuery } from '../../../../lib/paginate';
import { DateInterval } from '../../../../rent/domain/DateInterval';
import { Role } from '../../../../user/domain/types/role';
import { EditorRepository } from '../../../../user/infrastructure/persistence/repository/editor.repository';
import { AdminDto } from '../../../../user/infrastructure/rest/dtos/admin/admin-dto';
import { CreateVehicleService } from '../../../application/create';
import { DeleteVehicleService } from '../../../application/delete';
import { GetVehicleService } from '../../../application/get-vehicle-by-id';
import { PaginateVehicleService } from '../../../application/paginate';
import { UpdateVehicleService } from '../../../application/update';
import { Vehicle } from '../../../domain/models/vehicle';
import { VehicleEntity } from '../../persistence/entities/vehicle.entity';
import { VehicleMariadbRepository } from '../../persistence/repositories/vehicle.mariadb.repository';
import { AvailableVehicleDto } from '../dtos/available-vehicle';
import { CreateVehicleDto } from '../dtos/create-vehicle';

@UseGuards(AuthGuard, RoleGuard)
@Controller('vehicle')
export class VehicleController {
  constructor(
    private createVehicleService: CreateVehicleService,
    private paginateVehicleService: PaginateVehicleService,
    private getVehicleService: GetVehicleService,
    private updateVehicleService: UpdateVehicleService,
    private deleteVehicleService: DeleteVehicleService,
    private editorRepository: EditorRepository,
    private vehicleRepository: VehicleMariadbRepository,
  ) {}

  @Roles({ roles: [Role.ADMIN, Role.EDITOR], mode: RoleMatchingMode.ANY })
  @Post()
  async create(
    @AuthenticatedUser() user: AdminDto,
    @Body() vehicle: CreateVehicleDto,
  ) {
    let office = vehicle.office;
    if (user.resource_access['drakars-admin-api'].roles.includes(Role.EDITOR)) {
      const editor = await this.editorRepository.findOne(
        { id: user.sub },
        { relations: ['office'] },
      );
      office = editor.office.id;
    } else if (!office) {
      throw new BadRequestException('Admin user does not select office id');
    }
    const newVehicle = Vehicle.fromDto(vehicle);
    return this.createVehicleService.create(
      newVehicle,
      office,
      vehicle.imageId,
    );
  }

  @Unprotected()
  @Post('/paginate')
  @HttpCode(200)
  paginate(
    @Body()
    query: PaginateQuery & {
      relations: ('rents' | 'office' | 'ratings')[];
      paginateOptions: PaginateConfig<VehicleEntity>;
    },
  ) {
    return this.paginateVehicleService.paginate(query);
  }

  @Unprotected()
  @Post('/available')
  @HttpCode(200)
  available(@Body() dto: AvailableVehicleDto & PaginateQuery) {
    const interval = new DateInterval(dto.startDate, dto.endDate);
    if (!interval.isValid()) {
      throw new BadRequestException('Start date is after end date');
    }
    return this.getVehicleService.listAvailable(dto);
  }

  @Unprotected()
  @Put('/:id')
  update(@Param('id') id: number, @Body() dto: CreateVehicleDto) {
    const updateVehicle = Vehicle.fromDto(dto);
    return this.updateVehicleService.update(id, updateVehicle, dto.imageId);
  }

  @Unprotected()
  @Get(':id')
  get(@Param('id') id: number) {
    return this.getVehicleService.getById(id);
  }

  @Unprotected()
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.deleteVehicleService.delete(id);
  }

  @Unprotected()
  @Patch(':id')
  async changeActive(
    @Param('id') id: number,
    @Body() dto: { active: boolean },
  ) {
    if (dto && dto.active !== undefined && dto.active !== null) {
      const active = !!dto.active;
      const entity = await this.vehicleRepository.findOne({ id });
      entity.active = active;
      return this.vehicleRepository.save(entity);
    }
  }
}
