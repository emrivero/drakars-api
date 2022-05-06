import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { SeedConfigService } from './config.service';
import configuration from './configuration';
/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        importClient: Joi.bool(),
        importEditor: Joi.bool(),
        importAdmin: Joi.bool(),
        importOffice: Joi.bool(),
        importCity: Joi.bool(),
        importMunicipality: Joi.bool(),
        importVehicle: Joi.bool(),
      }),
    }),
  ],
  providers: [ConfigService, SeedConfigService],
  exports: [ConfigService, SeedConfigService],
})
export class SeedConfigModule {}
