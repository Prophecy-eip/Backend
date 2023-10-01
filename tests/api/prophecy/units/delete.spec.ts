import { HttpStatus, INestApplication } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import { TestsHelper } from "../../../tests.helper";
import * as request from "supertest";
import { PROPHECY_UNIT_REQUEST } from "../../../fixtures/prophecy/prophecy";

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

    it("units/delete: basic delete - then should return 200 (Ok)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(PROPHECY_UNIT_REQUEST);

        const propheciesRes = await request(app.getHttpServer())
            .get(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = propheciesRes.body[0]?.id;

        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.UNIT_PROPHECY_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);
        const propheciesRes2 = await request(app.getHttpServer())
            .get(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        expect(propheciesRes2.body.find(prophecy => prophecy.id === id)).toEqual(undefined);
    });

    it("units/delete: delete with invalid token - then should return 401 (Unauthorized)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(PROPHECY_UNIT_REQUEST);

        const propheciesRes = await request(app.getHttpServer())
            .get(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = propheciesRes.body[0]?.id;

        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.UNIT_PROPHECY_ROUTE}/${id}`)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("units/delete: delete not owned prophecy - then should return 403 (Forbidden)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(PROPHECY_UNIT_REQUEST);

        const propheciesRes = await request(app.getHttpServer())
            .get(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = propheciesRes.body[0]?.id;
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.UNIT_PROPHECY_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`);

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("units/delete: delete without id - then should return 404 (Not found)", async () => {
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.UNIT_PROPHECY_ROUTE}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("units/delete: delete un-existing prophecy - then should return 404 (Not found)", async () => {
        const id: string = "abcd";
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.UNIT_PROPHECY_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });
});
