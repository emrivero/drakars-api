import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { GetOfficeService } from '../../../office/application/get-by-id';
import { RentCarService } from '../../application/rent-car';
import { RentCardDto } from './dto/rent-car';

@Controller('rent-car')
export class RentController {
  constructor(
    private readonly rentCarService: RentCarService,
    private readonly getOffice: GetOfficeService,
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
}
