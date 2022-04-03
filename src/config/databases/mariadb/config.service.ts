import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class MariaDBConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const config: TypeOrmModuleOptions = {
      type: this.type,
      host: this.host,
      port: this.port,
      username: this.user,
      password: this.pass,
      database: this.db,
      synchronize: true,
      autoLoadEntities: true,
      // entities: [VehicleEntity],
    };

    return config;
  }

  get host(): string {
    return this.configService.get<string>('mariadb.host');
  }

  get port(): number {
    return this.configService.get<number>('mariadb.port');
  }

  get db(): string {
    return this.configService.get<string>('mariadb.db');
  }

  get user(): string {
    return this.configService.get<string>('mariadb.user');
  }

  get pass(): string {
    return this.configService.get<string>('mariadb.pass');
  }

  get type(): 'mariadb' | 'mysql' {
    return this.configService.get<'mariadb' | 'mysql'>('mariadb.type');
  }

  get sync(): boolean {
    return this.configService.get<boolean>('mariadb.sync');
  }
}
