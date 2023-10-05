import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { TestsHelper } from "../../tests.helper";
import * as request from "supertest";
import { ARMY1, ARMY2 } from "../../fixtures/army-list/armies-lists";
import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";

jest.setTimeout(60000);

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

let app: INestApplication;
let token: string;
let token1: string;

describe("armies-lists/delete", () => {
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

    beforeEach(async () => {
        await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(ARMY1).then(res => res.body.id);

        await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token1}`).send(ARMY2).then(res => res.body.id);
    });

    afterAll(async () => {
        const res = await request(app.getHttpServer())
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

    it("basic delete - should return 200 (ok)", async () => {
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);

        const res2 = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res2.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("use invalid token - should return unauthorised (401)", async () => {
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });


    it("not the owner - should return forbidden (403)", async () => {
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`);

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("use invalid army list id - should return not found (404)", async () => {
        const id: string = "abcd";
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });
});
