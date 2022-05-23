import { registerAs } from '@nestjs/config';
export default registerAs('keycloak-admin', () => ({
  authUrl: process.env.KEYCLOAK_AUTH_URL,
  realm: process.env.KEYCLOAK_ADMIN_REALM,
  secret: process.env.KEYCLOAK_SECRET,
  clientID: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
  clientAdminUser: process.env.KEYCLOAK_ADMIN_ADMIN_USER,
  clientAdminPassword: process.env.KEYCLOAK_ADMIN_ADMIN_PASS,
}));
