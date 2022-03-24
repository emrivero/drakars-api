import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { KeycloakConfigService } from './config.service';
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
        KEYCLOAK_AUTH_URL: Joi.string(),
        KEYCLOAK_REALM: Joi.string(),
        KEYCLOAK_CLIENT_ID: Joi.string(),
        KEYCLOAK_SECRET: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, KeycloakConfigService],
  exports: [ConfigService, KeycloakConfigService],
})
export class KeycloakConfigModule {}
