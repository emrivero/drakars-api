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
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser, AuthGuard, RoleGuard } from 'nest-keycloak-connect';
import { MoreThanOrEqual } from 'typeorm';
import { ClientDto } from '../../../client/infrastructure/rest/dtos/client.dto';
import { GetOfficeService } from '../../../office/application/get-by-id';
import { CancelRentService } from '../../application/cancel-rent';
import { CreateInvoiceService } from '../../application/create-invoice';
import { GetRentServive } from '../../application/get-rent';
import { NodeMailerService } from '../../application/mailer/MailerService';
import { RentCarService } from '../../application/rent-car';
import { RentRepository } from '../persistence/repository/rent.repository';
import { RentCardDto } from './dto/rent-car';

@Controller('rent-car')
export class RentController {
  constructor(
    private readonly rentCarService: RentCarService,
    private readonly getOffice: GetOfficeService,
    private readonly getRentService: GetRentServive,
    private readonly cancelRentService: CancelRentService,
    @Inject(RentRepository)
    private readonly rentRepository: RentRepository,
    private readonly createInvoiceService: CreateInvoiceService,
    private readonly mailer: NodeMailerService,
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

    const rent = await this.rentCarService.rent(dto, origin, destiny);
    this.mailer.sendRentConfirmation(rent);
    return rent;
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

    const rent = await this.rentCarService.rent(dto, origin, destiny);
    this.mailer.sendRentConfirmation(rent);
    return rent;
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

  @Get('by-reference/:email/:reference')
  getRentByReference(
    @Param('email') email: string,
    @Param('reference') reference: string,
  ) {
    return this.rentRepository.findOne({
      where: [
        {
          renterUser: { email },
          reference,
          status: 'pending',
          startDate: MoreThanOrEqual(new Date()),
        },
        {
          renterUser: { email },
          reference,
          status: 'checkedin',
        },
        {
          renterUser: { email },
          reference,
          status: 'delayed',
        },
      ],
      relations: [
        'rentedVehicle',
        'renterUser',
        'originOffice',
        'destinyOffice',
        'originOffice.municipality',
        'destinyOffice.municipality',
        'originOffice.municipality.city',
        'destinyOffice.municipality.city',
      ],
    });
  }

  // @Patch(':dni/:reference')
  // updateRent(
  //   @Param('dni') dni: string,
  //   @Param('reference') reference: string,
  //   @Body() dto: UpdateRentCardDto,
  // ) {
  //   return this.rentCarService.editRent(dni, reference, dto);
  // }

  @Delete(':reference')
  async cancelRent(@Param('reference') reference: string) {
    const rent = await this.getRentService.find(reference);
    if (!rent || rent.status === 'checkedin' || rent.status === 'checkedout') {
      throw new BadRequestException();
    }
    return this.cancelRentService.cancel(reference);
  }

  @Get('download/:reference')
  async downloadReference(
    @Param('reference') reference: string,
    @Response() res,
  ) {
    const rent = await this.rentRepository.findOne(
      {
        reference,
      },
      {
        relations: [
          'renterUser',
          'rentedVehicle',
          'rentedVehicle.image',
          'destinyOffice',
          'originOffice',
          'destinyOffice.municipality',
          'originOffice.municipality',
          'destinyOffice.municipality.city',
          'originOffice.municipality.city',
        ],
      },
    );
    const pdf = this.createInvoiceService.create(rent);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${reference}.pdf"`,
    });
    pdf.pipe(res);
    pdf.end();
    return res;
  }
}
