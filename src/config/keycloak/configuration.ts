import { registerAs } from '@nestjs/config';
export default registerAs('keycloak', () => ({
  authUrl: process.env.KEYCLOAK_AUTH_URL,
  realm: process.env.KEYCLOAK_REALM,
  clientID: process.env.KEYCLOAK_CLIENT_ID,
  secret: process.env.KEYCLOAK_SECRET,
  clientAdminUser: process.env.KEYCLOAK_ADMIN_USER,
  clientAdminPassword: process.env.KEYCLOAK_ADMIN_PASS,
}));
