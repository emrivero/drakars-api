import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongoDBConfigService } from './config.service';
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
        MONGO_HOST: Joi.string(),
        MONGO_PORT: Joi.number(),
        MONGO_DB: Joi.string(),
        MONGO_USER: Joi.string(),
        MONGO_PASS: Joi.string(),
        MONGO_AUTHSOURCE: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, MongoDBConfigService],
  exports: [ConfigService, MongoDBConfigService],
})
export class MongoDBConfigModule {}
