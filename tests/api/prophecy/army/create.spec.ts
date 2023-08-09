import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import { TestsHelper } from "../../../tests.helper";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ARMY1, ARMY2 } from "../../../fixtures/army-list/armies-lists";

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();

let app: INestApplication;
let userToken: string;
let user1Token: string;

let userArmyListId1: string;
let userArmyListId2: string;

let user1ArmyListId_notShared: string;
let user1ArmyListId_shared: string;

jest.setTimeout(70000);

describe("prophecies/armies/create", () => {
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
        userToken = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), USERNAME, EMAIL,
            PASSWORD);
        user1Token = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), USERNAME1, EMAIL1,
            PASSWORD);
        userArmyListId1 = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send(ARMY1).then(res => res.body.id);
        userArmyListId2 = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send(ARMY2).then(res => res.body.id);
        user1ArmyListId_notShared = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${user1Token}`).send(ARMY1).then(res => res.body.id);
        user1ArmyListId_shared = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${user1Token}`).send(ARMY2).then(res => res.body.id);

    });

    afterAll(async () => {
        await TestsHelper.deleteAccount(app.getHttpServer(), userToken);
        await TestsHelper.deleteAccount(app.getHttpServer(), user1Token);
    });

    it("request basic army prophecy - then should return 201 (created)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send({
                armyList1: userArmyListId1,
                armyList2: userArmyListId2
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
        expect(res.body.id).toBeDefined();
        expect(res.body.armyList1).toEqual(userArmyListId1);
        expect(res.body.armyList2).toEqual(userArmyListId2);
        expect(res.body.player1Score).toBeDefined();
        expect(res.body.player2Score).toBeDefined();
    });

    it("request army prophecy, no army list 1 - then should return 400 (bad request)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send({
                armyList2: userArmyListId2
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("request army prophecy, no army list 2 - then should return 400 (bad request)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send({
                armyList1: userArmyListId1
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("request army prophecy, wrong token - then should return 401 (unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer abcd`).send({
                armyList1: userArmyListId1,
                armyList2: userArmyListId2
            });

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("request army prophecy, not existing army list 1 - then should return 404 (not found)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send({
                armyList1: "abcd",
                armyList2: userArmyListId2
            });

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("request army prophecy, not existing army list 2 - then should return 404 (not found)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send({
                armyList1: userArmyListId1,
                armyList2: "abcd"
            });

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("request army prophecy, not owned not shared army list 1 - then should return 403 (forbidden)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send({
                armyList1: user1ArmyListId_notShared,
                armyList2: userArmyListId1
            });

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("request army prophecy, not owned not shared army list 2 - then should return 403 (forbidden)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send({
                armyList1: userArmyListId1,
                armyList2: user1ArmyListId_notShared
            });

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("request army prophecy, not owned shared army list 1- then should return 201 (created)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send({
                armyList1: user1ArmyListId_shared,
                armyList2: userArmyListId1
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("request army prophecy, not owned shared army list 2 - then should return 201 (created)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send({
                armyList1: userArmyListId1,
                armyList2: user1ArmyListId_shared
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });
});
