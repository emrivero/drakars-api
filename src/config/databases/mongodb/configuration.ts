import { registerAs } from '@nestjs/config';
export default registerAs('mongodb', () => ({
  uri: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  db: process.env.MONGO_DB,
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  authSource: process.env.MONGO_AUTHSOURCE,
}));
