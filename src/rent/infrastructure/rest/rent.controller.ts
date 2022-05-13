import { Body, Controller, Post } from '@nestjs/common';
import { RentCarService } from '../../application/rent-car';
import { RentCardDto } from './dto/rent-car';

@Controller('rent-car')
export class RentController {
  constructor(private readonly rentCarService: RentCarService) {}
  @Post()
  rentCar(@Body() dto: RentCardDto) {
    return this.rentCarService.rent(dto);
  }
}
