import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { GetOfficeService } from '../../../office/application/get-by-id';
import { CancelRentService } from '../../application/cancel-rent';
import { GetRentServive } from '../../application/get-rent';
import { RentCarService } from '../../application/rent-car';
import { RentCardDto } from './dto/rent-car';

@Controller('rent-car')
export class RentController {
  constructor(
    private readonly rentCarService: RentCarService,
    private readonly getOffice: GetOfficeService,
    private readonly getRentService: GetRentServive,
    private readonly cancelRentService: CancelRentService,
  ) {}

  @Post()
  async rentCar(@Body() dto: RentCardDto) {
    const origin = await this.getOffice.getById(dto.originOffice);
    if (!origin) {
      throw new NotFoundException(`Office with id=${dto.originOffice}`);
    }

    const destiny = await this.getOffice.getById(dto.destinyOffice);
    if (!destiny) {
      throw new NotFoundException(`Office with id=${dto.destinyOffice}`);
    }
    return this.rentCarService.rent(dto, origin, destiny);
  }

  @Get(':dni/:reference')
  getRent(@Param('dni') dni: string, @Param('reference') reference: string) {
    return this.getRentService.find(dni, reference);
  }

  @Delete('cance/:dni/:reference')
  cancelRent(@Param('dni') dni: string, @Param('reference') reference: string) {
    return this.cancelRentService.cancel(dni, reference);
  }
}
