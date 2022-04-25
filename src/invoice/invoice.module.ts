import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from './infrastructure/persistence/entity/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity])],
})
export class InvoiceModule {}
