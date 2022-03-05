import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDBConfigModule } from './config/databases/mongodb/config.module';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { MongoDBConfigService } from './config/databases/mongodb/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './.env', isGlobal: true, expandVariables: true}),
    TypegooseModule.forRootAsync({
      imports: [MongoDBConfigModule],
      useExisting: MongoDBConfigService
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
