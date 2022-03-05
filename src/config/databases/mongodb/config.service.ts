import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions, TypegooseOptionsFactory } from 'nestjs-typegoose/dist/typegoose-options.interface';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class MongoDBConfigService implements TypegooseOptionsFactory{
  constructor(private configService: ConfigService) {}

  get uri(): string {
    return `mongodb://${this.host}:${this.port}/${this.db}`;
  }
  get host(): string {
    return this.configService.get<string>('mongodb.host');
  }
  get port(): string {
    return this.configService.get<string>('mongodb.port');
  }
  get db(): string {
    return this.configService.get<string>('mongodb.db');
  }
  get user(): string {
    return this.configService.get<string>('mongodb.user');
  }
  get pass(): string {
    return this.configService.get<string>('mongodb.pass');
  }
  get authSource(): string {
    return this.configService.get<string>('mongodb.authSource');
  }
  get options(): object {
    return {
      user: this.user,
      pass: this.pass,
      authSource: this.authSource,
      ...this.extraOptions
    };
  }

  public get extraOptions(): object {
    return {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      autoIndex: true
    };
  }

  createTypegooseOptions(): Promise<TypegooseModuleOptions> | TypegooseModuleOptions {
    return {
      uri: this.uri,
      ...this.options
    };
  }

}
