import { Module } from '@nestjs/common';
import configuration from './configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoDBConfigService } from './config.service';
import Joi from 'joi';
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
        MONGO_HOST: Joi.string().default('mongodb'),
        MONGO_PORT: Joi.number().default(27017),
        MONGO_DB: Joi.string().default('starter'),
        MONGO_USER: Joi.string().default('root'),
        MONGO_PASS: Joi.string().default('root'),
        MONGO_AUTHSOURCE: Joi.string().default('admin')
      }),
    }),
  ],
  providers: [ConfigService, MongoDBConfigService],
  exports: [ConfigService, MongoDBConfigService],
})
export class MongoDBConfigModule {}
