import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser, AuthGuard, RoleGuard } from 'nest-keycloak-connect';
import { ClientDto } from '../../../client/infrastructure/rest/dtos/client.dto';
import { GetOfficeService } from '../../../office/application/get-by-id';
import { CancelRentService } from '../../application/cancel-rent';
import { GetRentServive } from '../../application/get-rent';
import { RentCarService } from '../../application/rent-car';
import { RentRepository } from '../persistence/repository/rent.repository';
import { RentCardDto } from './dto/rent-car';
import { UpdateRentCardDto } from './dto/update-rent-dto';

@Controller('rent-car')
export class RentController {
  constructor(
    private readonly rentCarService: RentCarService,
    private readonly getOffice: GetOfficeService,
    private readonly getRentService: GetRentServive,
    private readonly cancelRentService: CancelRentService,
    @Inject(RentRepository)
    private readonly rentRepository: RentRepository,
  ) {}

  @Post()
  async rentCar(@Body() dto: RentCardDto) {
    await this.rentCarService.checkExistsRegistered(dto.user.email);
    const origin = await this.getOffice.getById(dto.originOffice);
    if (!origin) {
      throw new NotFoundException(`Office with id=${dto.originOffice}`);
    }

    const destiny = await this.getOffice.getById(dto.destinyOffice);
    if (!destiny) {
      throw new NotFoundException(`Office with id=${dto.destinyOffice}`);
    }

    const existsRent = await this.rentRepository.getRent(dto.user.email);

    if (existsRent) {
      throw new ForbiddenException('This user already have a rent');
    }

    return await this.rentCarService.rent(dto, origin, destiny);
  }

  @Post('/logged')
  @UseGuards(RoleGuard, AuthGuard)
  async loggedRentCar(
    @AuthenticatedUser() clientDto: ClientDto,
    @Body() dto: RentCardDto,
  ) {
    const origin = await this.getOffice.getById(dto.originOffice);
    if (!origin) {
      throw new NotFoundException(`Office with id=${dto.originOffice}`);
    }

    const destiny = await this.getOffice.getById(dto.destinyOffice);
    if (!destiny) {
      throw new NotFoundException(`Office with id=${dto.destinyOffice}`);
    }

    const existsRent = await this.rentRepository.getRent(dto.user.email);

    if (existsRent) {
      throw new ForbiddenException('This user already have a rent');
    }

    return await this.rentCarService.rent(dto, origin, destiny);
  }

  @Get('exist-active-rent/:email')
  async existActiveRent(@Param('email') email: string) {
    const rent = await this.rentRepository.getRent(email);

    return { exist: !!rent?.id };
  }

  @Get(':reference')
  getRent(@Param('reference') reference: string) {
    return this.getRentService.find(reference);
  }

  @Patch(':dni/:reference')
  updateRent(
    @Param('dni') dni: string,
    @Param('reference') reference: string,
    @Body() dto: UpdateRentCardDto,
  ) {
    return this.rentCarService.editRent(dni, reference, dto);
  }

  @Delete(':reference')
  async cancelRent(@Param('reference') reference: string) {
    const rent = await this.getRentService.find(reference);
    if (!rent || rent.status === 'checkedin' || rent.status === 'checkedout') {
      throw new BadRequestException();
    }
    return this.cancelRentService.cancel(reference);
  }
}
