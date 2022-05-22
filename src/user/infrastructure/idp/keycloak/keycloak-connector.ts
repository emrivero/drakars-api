import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';
import { Issuer } from 'openid-client';
import { KeycloakAdminConfigService } from '../../../../config/keycloak-admin/config.service';

@Injectable()
export class KeycloakConnector {
  private readonly INTERVAL_REFRESH_TOKEN = 60 * 1000;
  private readonly GRANT_TYPE = 'password';
  private kcAdminClient: KcAdminClient = null;

  constructor(private readonly kcConfig: KeycloakAdminConfigService) {}

  public async getkcClient() {
    if (this.kcAdminClient) {
      return this.kcAdminClient;
    }

    this.kcAdminClient = new KcAdminClient({
      baseUrl: this.kcConfig.authUrl,
      realmName: this.kcConfig.realm,
    });

    await this.kcAdminClient.auth({
      clientId: this.kcConfig.clientID,
      grantType: this.GRANT_TYPE,
      username: this.kcConfig.clientAdminUser,
      password: this.kcConfig.clientAdminPassword,
    });

    await this.kcAdminClient.setConfig({
      realmName: this.kcConfig.realm,
    });

    await this.setIntervalRefreshToken();

    return this.kcAdminClient;
  }

  private async setIntervalRefreshToken() {
    const keycloakIssuer = await Issuer.discover(
      `${this.kcConfig.authUrl}/realms/${this.kcConfig.realm}`,
    );

    const issuerClient = new keycloakIssuer.Client({
      client_id: this.kcConfig.clientID,
      token_endpoint_auth_method: 'none', // to send only client_id in the header
    });

    let tokenSet = await issuerClient.grant({
      grant_type: this.GRANT_TYPE,
      username: this.kcConfig.clientAdminUser,
      password: this.kcConfig.clientAdminPassword,
    });

    // Periodically using refresh_token grant flow to get new access token here
    await setInterval(async () => {
      const refreshToken = tokenSet.refresh_token;
      tokenSet = await issuerClient.refresh(refreshToken);
      this.kcAdminClient.setAccessToken(tokenSet.access_token);
    }, this.INTERVAL_REFRESH_TOKEN);
  }
}
