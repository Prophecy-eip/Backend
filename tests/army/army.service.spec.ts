import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";

import {Army} from "../../src/army/army.entity";
import {ArmyService} from "../../src/army/army.service";
import {ArmyModule} from "../../src/army/army.module";

dotenv.config()

const DB = process.env.POSTGRES_DB;
const DB_HOST = process.env.DATABASE_IP;
const DB_PORT: number = +process.env.DATABASE_PORT;
const DB_USERNAME = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_DIALECT = "postgres"

describe("ArmyService", () => {
    let service: ArmyService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule(({
            imports: [TypeOrmModule.forRoot({
                type: DB_DIALECT,
                host: DB_HOST,
                port: DB_PORT,
                username: DB_USERNAME,
                password: DB_PASSWORD,
                database: DB,
                entities: [Army],
                synchronize: true,
            }),
                ArmyModule],
        })).compile();

        service = moduleRef.get<ArmyService>(ArmyService);
    });

    it("Retrieve all armies", async () => {
        const armies: Army [] = await service.getAll();

        expect(armies).toBeDefined()
        expect(armies.length).toBeGreaterThan(0);
    });
})