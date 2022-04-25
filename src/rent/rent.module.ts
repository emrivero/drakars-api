import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentEntity } from './infrastructure/persistence/entity/rent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RentEntity])],
})
export class RentModule {}
