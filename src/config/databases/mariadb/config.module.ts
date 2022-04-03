import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MariaDBConfigService } from './config.service';
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
        host: Joi.string(),
        port: Joi.number(),
        db: Joi.string(),
        user: Joi.string(),
        pass: Joi.string(),
        type: Joi.string().valid('mysql', 'mariadb'),
        sync: Joi.boolean(),
      }),
    }),
  ],
  providers: [ConfigService, MariaDBConfigService],
  exports: [ConfigService, MariaDBConfigService],
})
export class MariaDBConfigModule {}
