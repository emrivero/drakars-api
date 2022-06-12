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
  Unprotected,
} from 'nest-keycloak-connect';
import { NodeMailerService } from '../../../../rent/application/mailer/MailerService';
import { RentRepository } from '../../../../rent/infrastructure/persistence/repository/rent.repository';
import { CreateClientService } from '../../../application/create/CreateUserService';
import { DeleteClientService } from '../../../application/delete';
import { GetClientService } from '../../../application/find';
import { UpdateClientService } from '../../../application/update';
import { ClientDto } from '../dtos/client.dto';
import { ContactDto } from '../dtos/contact.dto';
import { UpdateClientDto } from '../dtos/update-client.dto';

@UseGuards(AuthGuard, RoleGuard)
@Controller('client')
export class ClientController {
  constructor(
    private readonly createService: CreateClientService,
    private readonly findService: GetClientService,
    private readonly updateService: UpdateClientService,
    private readonly deleteService: DeleteClientService,
    @Inject(RentRepository)
    private readonly rentRepository: RentRepository,
    private readonly nodeMailer: NodeMailerService,
  ) {}

  @Post()
  @Roles({ roles: ['user'] })
  async autoregister(@AuthenticatedUser() dto: ClientDto) {
    return this.createService.create(dto);
  }

  @Get('getme')
  async getMe(@AuthenticatedUser() dto: ClientDto) {
    return this.findService.findByEmail(dto);
  }

  @Put('editme')
  @Roles({ roles: ['user'] })
  async editMe(
    @Body() newData: UpdateClientDto,
    @AuthenticatedUser() dto: ClientDto,
  ) {
    return this.updateService.update(newData, dto);
  }

  @Delete('deleteme')
  @Roles({ roles: ['user'] })
  async deleteMe(@AuthenticatedUser() dto: ClientDto) {
    const { sub, email } = dto;
    return this.deleteService.delete(sub, email);
  }

  @Get('getrent')
  @Roles({ roles: ['user'] })
  async getRent(@AuthenticatedUser() dto: ClientDto) {
    const { email } = dto;
    return this.rentRepository.getRent(email);
  }

  @Get('getrents')
  @Roles({ roles: ['user'] })
  async getRentsHistory(@AuthenticatedUser() dto: ClientDto) {
    const { email } = dto;
    return this.rentRepository.getOldRents(email);
  }

  @Unprotected()
  @Post('contact')
  async contact(@Body() dto: ContactDto) {
    return this.nodeMailer.sendContactEmail(dto);
  }
}
