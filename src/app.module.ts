import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

import { AccountsController } from './controllers/accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from "dotenv";

dotenv.config()

const HOST = process.env.DATABASES_IP;
const PORT: number = +process.env.DATABASES_PORT;
const USERNAME = process.env.POSTGRES_USER;
const PASSWORD: string = process.env.POSTGRES_PASSWORD;
const DIALECT = "postgres"

@Module({
  imports: [TypeOrmModule.forRoot({
    type: DIALECT,
    host: HOST,
    port: PORT,
    database: "prophecy_users",
    username: USERNAME,
    password: PASSWORD,
    autoLoadEntities: true,
    entities: ["../models/*.entity.ts"],
    logging: true,
  })],
  controllers: [AccountsController],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
