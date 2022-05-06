import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedConfigService {
  constructor(private configService: ConfigService) {}

  get importClient(): boolean {
    return JSON.parse(this.configService.get<string>('seed.importClient'));
  }
  get importEditor(): boolean {
    return JSON.parse(this.configService.get<string>('seed.importEditor'));
  }
  get importAdmin(): boolean {
    return JSON.parse(this.configService.get<string>('seed.importAdmin'));
  }
  get importOffice(): boolean {
    return JSON.parse(this.configService.get<string>('seed.importOffice'));
  }
  get importCity(): boolean {
    return JSON.parse(this.configService.get<string>('seed.importCity'));
  }
  get importMunicipality(): boolean {
    return JSON.parse(
      this.configService.get<string>('seed.importMunicipality'),
    );
  }
  get importVehicle(): boolean {
    return JSON.parse(this.configService.get<string>('seed.importVehicle'));
  }
}
