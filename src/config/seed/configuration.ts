import { registerAs } from '@nestjs/config';
export default registerAs('seed', () => ({
  importClient: process.env.IMPORT_CLIENT,
  importEditor: process.env.IMPORT_EDITOR,
  importAdmin: process.env.IMPORT_ADMIN,
  importOffice: process.env.IMPORT_OFFICE,
  importCity: process.env.IMPORT_CITY,
  importMunicipality: process.env.IMPORT_MUNICIPALITY,
  importVehicle: process.env.IMPORT_VEHICLE,
}));
