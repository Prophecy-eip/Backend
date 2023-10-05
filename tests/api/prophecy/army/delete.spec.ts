import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import { TestsHelper } from "../../../tests.helper";
import * as request from "supertest";
import { ARMY1, ARMY2 } from "../../../fixtures/army-list/armies-lists";

jest.setTimeout(70000);

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
let prophecyId: string;

describe("prophecies/armies/delete", () => {
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
    });

    beforeEach(async () => {
        prophecyId =  await request(app.getHttpServer())
            .post(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send({
                armyList1: userArmyListId1,
                armyList2: userArmyListId2
            }).then((res) => res.body.id);

    })

    afterAll(async () => {
        await TestsHelper.deleteAccount(app.getHttpServer(), userToken);
        await TestsHelper.deleteAccount(app.getHttpServer(), user1Token);
    });

    it("basic delete - should return 200 (OK)", async () => {
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMY_PROPHECY_ROUTE}/${prophecyId}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toEqual(HttpStatus.OK);

        const prophecies = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMY_PROPHECY_ROUTE}/`)
            .set("Authorization", `Bearer ${userToken}`).then(res => res.body);

        prophecies.map(p => expect(p.id !== prophecyId));
    });

    it("Invalid token - should return 401 (Unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMY_PROPHECY_ROUTE}/${prophecyId}`)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("Not existing prophecy id - should return 404 (Not found)", async () => {
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMY_PROPHECY_ROUTE}/abcd`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("Not owned prophecy - should return 403 (Forbidden)", async () => {
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMY_PROPHECY_ROUTE}/${prophecyId}`)
            .set("Authorization", `Bearer ${user1Token}`);

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });

});
