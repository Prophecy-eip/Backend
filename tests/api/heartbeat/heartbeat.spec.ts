import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from 'supertest';

let app: INestApplication;

describe("Heartbeat route", () => {
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    })

    it("heartbeat: should return 200 (ok)", async () => {
        const res = await request(app.getHttpServer())
            .get("/heartbeat");

        expect(res.status).toEqual(HttpStatus.OK);
    })
})
