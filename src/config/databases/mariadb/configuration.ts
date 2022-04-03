import { registerAs } from '@nestjs/config';
export default registerAs('mariadb', () => ({
  host: process.env.MARIADB_HOST,
  port: process.env.MARIADB_PORT,
  db: process.env.MARIADB_DB,
  user: process.env.MARIADB_USER,
  pass: process.env.MARIADB_PASS,
  type: process.env.MARIADB_TYPE,
  sync: process.env.MARIADB_SYNC,
}));
