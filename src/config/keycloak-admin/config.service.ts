import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  TokenValidation,
} from 'nest-keycloak-connect';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class KeycloakAdminConfigService
  implements KeycloakConnectOptionsFactory
{
  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      authServerUrl: this.authUrl,
      realm: this.realm,
      clientId: this.clientID,
      secret: this.secret,
      tokenValidation: TokenValidation.OFFLINE,
    };
  }
  constructor(private configService: ConfigService) {}

  get authUrl(): string {
    return this.configService.get<string>('keycloak.authUrl');
  }

  get realm(): string {
    return this.configService.get<string>('keycloak.realm');
  }

  get clientID(): string {
    return this.configService.get<string>('keycloak.clientID');
  }

  get secret(): string {
    return this.configService.get<string>('keycloak.secret');
  }

  get clientAdminUser(): string {
    return this.configService.get<string>('keycloak.clientAdminUser');
  }

  get clientAdminPassword(): string {
    return this.configService.get<string>('keycloak.clientAdminPassword');
  }
}
