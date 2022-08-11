import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import {ProfileEntity} from "../models/profile.entity"

dotenv.config()

const HOST = process.env.DATABASES_IP;
const PORT: number = +process.env.DATABASES_PORT;
const USERNAME = process.env.POSTGRES_USER;
const PASSWORD = process.env.POSTGRES_PASSWORD;
const DIALECT = "postgres"

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DIALECT,
            host: HOST,
            port: PORT,
            database: "Prophecy_Users",
            username: USERNAME,
            password: PASSWORD,
            autoLoadEntities: true,
            entities: ["../models/*.entity.ts"],
            logging: true,
        }),
    ],
})
export class DatabaseModule {
    
}