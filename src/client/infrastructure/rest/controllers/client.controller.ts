import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticatedUser,
  AuthGuard,
  RoleGuard,
  Roles,
} from 'nest-keycloak-connect';
import { RentRepository } from '../../../../rent/infrastructure/persistence/repository/rent.repository';
import { CreateClientService } from '../../../application/create/CreateUserService';
import { DeleteClientService } from '../../../application/delete';
import { GetClientService } from '../../../application/find';
import { UpdateClientService } from '../../../application/update';
import { ClientDto } from '../dtos/client.dto';
import { UpdateClientDto } from '../dtos/update-client.dto';

@UseGuards(AuthGuard, RoleGuard)
@Controller('client')
@Roles({ roles: ['user'] })
export class ClientController {
  constructor(
    private readonly createService: CreateClientService,
    private readonly findService: GetClientService,
    private readonly updateService: UpdateClientService,
    private readonly deleteService: DeleteClientService,
    @Inject(RentRepository)
    private readonly rentRepository: RentRepository,
  ) {}

  @Post()
  async autoregister(@AuthenticatedUser() dto: ClientDto) {
    return this.createService.create(dto);
  }

  @Get('getme')
  async getMe(@AuthenticatedUser() dto: ClientDto) {
    return this.findService.findByEmail(dto);
  }

  @Put('editme')
  async editMe(
    @Body() newData: UpdateClientDto,
    @AuthenticatedUser() dto: ClientDto,
  ) {
    return this.updateService.update(newData, dto);
  }

  @Delete('deleteme')
  async deleteMe(@AuthenticatedUser() dto: ClientDto) {
    const { sub, email } = dto;
    return this.deleteService.delete(sub, email);
  }

  @Get('getrent')
  async getRent(@AuthenticatedUser() dto: ClientDto) {
    const { email } = dto;
    return this.rentRepository.getRent(email);
  }

  @Get('getrents')
  async getRentsHistory(@AuthenticatedUser() dto: ClientDto) {
    const { email } = dto;
    return this.rentRepository.getOldRents(email);
  }
}
