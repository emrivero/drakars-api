import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { rmSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { VehicleImageRepository } from '../../persistence/repositories/vehicle-images.repository';

@Controller('vehicle-image')
export class VehicleImageController {
  constructor(
    @Inject(VehicleImageRepository)
    private readonly vehicleImageRepository: VehicleImageRepository,
  ) {}

  @Get('paginate')
  async paginate(@Query('size') size = 12, @Query('page') page = 0) {
    const results = await this.vehicleImageRepository.find({
      skip: size * page,
      take: size,
      order: {
        updatedAt: 'DESC',
      },
    });
    const count = await this.vehicleImageRepository.count();
    return { results, count };
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: { name: string },
  ) {
    const type = image.mimetype.split('/')[1];
    const name = `${body.name}.${type}`;
    const data = image.buffer.toString('base64');
    const exists =
      (await this.vehicleImageRepository.count({
        name: body.name.toLowerCase(),
      })) > 0;

    if (!body?.name || exists) {
      throw new BadRequestException();
    }

    const pathFile = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'public',
      'static',
      'img',
      'vehicles',
      name,
    );

    writeFileSync(pathFile, data, { encoding: 'base64' });
    return this.vehicleImageRepository.uploadImage(body.name, type);
  }

  @Delete(':name')
  async delete(@Param('name') name: string) {
    const nameWithType = await this.vehicleImageRepository.getName(name);
    const pathFile = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'public',
      'static',
      'img',
      'vehicles',
      `${nameWithType}`,
    );
    rmSync(pathFile);
    return this.vehicleImageRepository.delete({ name });
  }
}
