import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { TestsHelper } from "../../tests.helper";
import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ARMY1, ARMY2, List } from "../../fixtures/army-list/armies-lists";

jest.setTimeout(25000)

const LIST_NAME: string = "my list";

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

let app: INestApplication;
let token: string;
let token1: string;

describe("armies-lists/create", () => {
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
        const res = await  request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        for (const a of res.body) {
            await request(app.getHttpServer())
                .delete(`${TestsHelper.ARMIES_LISTS_ROUTE}/${a.id}`)
                .set("Authorization", `Bearer ${token}`);
        }
        await TestsHelper.deleteAccount(app.getHttpServer(), token);
        await TestsHelper.deleteAccount(app.getHttpServer(), token1);
    });

    it("create: create basic lists - then should return 201 (created)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(ARMY1);

        expect(res1.status).toEqual(HttpStatus.CREATED);
        expect(res1.body.id).toBeDefined();
    });

    it("create: create list with invalid armyId - then should return 404 (not found)", async () => {
        const list: List = new List(LIST_NAME, 123456, 123, [], false, false);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("create: create list with invalid token - then should return 401 (unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer abcd`).send(ARMY1);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
});
