import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { faker } from "@faker-js/faker";

import { AppModule } from "../../../src/app.module";
import { TestsHelper } from "../../tests.helper";
import { ARMY1, ARMY2, List } from "../../fixtures/army-list/armies-lists";
import ArmyListHelper from "../../helper/army-list.helper";

jest.setTimeout(100000000);

const LIST_NAME: string = "my list";
const ARMY_ID: string = "3557-241b-5999-a3b1";
const COST: string = "50 pts";
const UNIT_ID: string = "46e2-fcb1-5337-a50e";
const OPTIONS_ID: string[] = ["0a9c-5e46-6e74-afae"];
const UPGRADES_ID: string[] = ["8534-d1f1-73a1-48e9"];
const NUMBER: number = 3;
const FORMATION = "3x1";
const IS_SHARED: boolean = false;

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

let app: INestApplication;
let token: string;
let token1: string;

describe("Armies lists route", () => {

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

    /**
     * CREATE
     */
    it("create: create basic lists - then should return 201 (created)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(ARMY1);

        expect(res1.status).toEqual(HttpStatus.CREATED);

        const a1 = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id1: string = a1.body[0].id;
        const listRes1 = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id1}`)
            .set("Authorization", `Bearer ${token}`);
        ArmyListHelper.compareLists(ARMY1, listRes1.body);

        const res2 = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(ARMY2);

        expect(res2.status).toEqual(HttpStatus.CREATED);

        const a2 = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id2: string = a2.body[1].id;
        const listRes2 = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id2}`)
            .set("Authorization", `Bearer ${token}`);
        ArmyListHelper.compareLists(ARMY2, listRes2.body);
    });

    it("create: create list with invalid armyId - then should return 404 (not found)", async () => {
        const list: List = new List(LIST_NAME, 123456, 123, [], false, false);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("create: create list with invalid token - then should return 401 (unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_CREATE_ROUTE)
            .set("Authorization", `Bearer abcd`).send(ARMY1);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    /**
     * LOOKUP
     */
    it("lookup: basic lookup - then return armies lists credentials", async () => {
        const res = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);
        expect(res.body).toBeDefined();
    });

    it("lookup: with invalid token - then return 401 (unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    /**
     * :ID
     */
    it(":id: basic get - then return 200 (ok)", async () => {
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);
        expect(res.status).toBeDefined();
    });

    it(":id: with invalid token - then return 401 (unauthorized)", async () => {
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(":id: user does not own a not-shared list - then return 403 (forbidden)", async () => {
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body.find(army => army.isShared === false).id;
        const res = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(":id: user does not own a shared list - then should return 200 (OK)", async () => {
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body.find(army => army.isShared === true).id;
        const res = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it(":id: with invalid id - then return 404 (not found)", async () => {
        const id: string = "abcd";
        const res = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND)
    });


    /**
     * DELETE
     */

    it("delete: basic delete - then should return 200 (ok)", async () => {
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMIES_LISTS_DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);

        const res2 = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res2.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("delete: use invalid token - then should return unauthorised (401)", async () => {
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMIES_LISTS_DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });


    it("delete: not the owner - then should return forbidden (403)", async () => {
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMIES_LISTS_DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`);

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("delete: use invalid army list id - then should return not found (404)", async () => {
        const id: string = "abcd";
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMIES_LISTS_DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    /**
     * UPDATE
     */

    it("update: basic - then should return 200 (ok) and values should have changed", async () => {
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_UPDATE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.OK);

        const listRes = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
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
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_UPDATE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("update: use invalid token - then should return 401 (unauthorized)", async () => {
        const a = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_UPDATE_ROUTE}/${id}`)
            .set("Authorization", `Bearer abcd`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
});
