import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { CreateClientService } from '../../../application/create/CreateUserService';
import { DeleteClientService } from '../../../application/delete';
import { GetClientService } from '../../../application/find';
import { UpdateClientService } from '../../../application/update';
import { Client } from '../../../domain/entities/client';
import { ClientDto } from '../dtos/client.dto';

// @UseGuards(RoleGuard)
@Controller('client')
// @Roles({ roles: [Role.CLIENT] })
export class ClientController {
  constructor(
    private readonly createService: CreateClientService,
    private readonly findService: GetClientService,
    private readonly updateService: UpdateClientService,
    private readonly deleteService: DeleteClientService,
  ) {}

  @Post()
  async autoregister(@AuthenticatedUser() dto: ClientDto) {
    //TODO: Pedir usuario a keycloak
    // name, lastName, dni, email, phone
    // Cambiar modelo de cliente para simplificar
    // Crear un mapper que convierta los usuarios de Keycloak en usuarios de BD
    const client = Client.fromDto(dto);
    return this.createService.create(client);
  }

  @Get('getme')
  async getMe(@AuthenticatedUser() dto: ClientDto) {
    const client = Client.fromDto(dto);
    return this.findService.findByEmail(client);
  }

  @Put('editme')
  async editMe(
    @Body() newData: ClientDto,
    @AuthenticatedUser() dto: ClientDto,
  ) {
    const newClient = Client.fromDto(newData);
    const client = Client.fromDto(dto);
    return this.updateService.update(newClient, client);
  }

  @Delete('deleteme')
  async deleteMe(@AuthenticatedUser() dto: ClientDto) {
    const client = Client.fromDto(dto);
    return this.deleteService.delete(client);
  }
}
