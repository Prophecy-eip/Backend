import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { TestsHelper } from "../../tests.helper";
import * as request from "supertest";
import { ARMY1, ARMY2 } from "../../fixtures/army-list/armies-lists";
import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import ArmyListHelper from "../../helper/army-list.helper";

jest.setTimeout(70000);

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

let app: INestApplication;
let token: string;
let token1: string;
let user1ListId: string;
let user2ListId: string;

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

        user1ListId = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(ARMY1).then(res => res.body.id);

        user2ListId = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_CREATE_ROUTE)
            .set("Authorization", `Bearer ${token1}`).send(ARMY2).then(res => res.body.id);
    });

    afterAll(async () => {
        const res = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        for (const a of res.body) {
            await request(app.getHttpServer())
                .delete(`${TestsHelper.ARMIES_LISTS_DELETE_ROUTE}/${a.id}`)
                .set("Authorization", `Bearer ${token}`);
        }
        await TestsHelper.deleteAccount(app.getHttpServer(), token);
        await TestsHelper.deleteAccount(app.getHttpServer(), token1);
    });

    it("update: basic - then should return 200 (ok) and values should have changed", async () => {
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_UPDATE_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.OK);

        const listRes = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`)
        ArmyListHelper.compareLists(ARMY2, listRes.body);
    });

    it("update: use invalid armyId - then should return 404 (not found)", async () => {
        const id: string = "abcd";
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_UPDATE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("update: try update not owned list - then should return 403 (forbidden)", async () => {
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_UPDATE_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token1}`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("update: use invalid token - then should return 401 (unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_UPDATE_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer abcd`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
});
