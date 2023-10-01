import { HttpStatus, INestApplication } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import { TestsHelper } from "../../../tests.helper";
import * as request from "supertest";

let app: INestApplication;
let token: string;
let token1: string;

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

describe("Prophecies route", () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
        token = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), USERNAME, EMAIL,
            PASSWORD);
        token1 = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), USERNAME1, EMAIL1,
            PASSWORD);

    });

    afterAll(async () => {
        await TestsHelper.deleteAccount(app.getHttpServer(), token);
        await TestsHelper.deleteAccount(app.getHttpServer(), token1);
    });

    it("units/lookup: basic lookup - then should return 200 (Ok)", async () => {
        const res = await request(app.getHttpServer())
            .get(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);
        for (const prophecy of res.body) {
            expect(prophecy.attackingRegiment).toBeDefined();
            expect(prophecy.defendingRegiment).toBeDefined();
            expect(prophecy.bestCase).toBeDefined();
            expect(prophecy.meanCase).toBeDefined();
            expect(prophecy.worstCase).toBeDefined();
            expect(prophecy.id).toBeDefined();
        }
    });

    it("units/lookup: lookup with invalid token - then should return 401 (Unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .get(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
});
