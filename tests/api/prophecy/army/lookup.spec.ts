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

// const USERNAME1 = faker.internet.userName();
// const EMAIL1 = faker.internet.email();

let app: INestApplication;
let userToken: string;
// let user1Token: string;

let userArmyListId1: string;
let userArmyListId2: string;

let nb: number;

// let user1ArmyListId_notShared: string;
// let user1ArmyListId_shared: string;

jest.setTimeout(40000);

describe("prophecies/armies/create", () => {
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
        nb = Math.floor(Math.random() * 9) + 1;
        userToken = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), USERNAME, EMAIL,
            PASSWORD);
        userArmyListId1 = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send(ARMY1).then(res => res.body.id);
        userArmyListId2 = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${userToken}`).send(ARMY2).then(res => res.body.id);
        for (let i = 0; i < nb; i++) {
            const res = await request(app.getHttpServer())
                .post(TestsHelper.ARMY_PROPHECY_ROUTE)
                .set("Authorization", `Bearer ${userToken}`).send({
                    armyList1: userArmyListId1,
                    armyList2: userArmyListId2
                });
        }
    });

    afterAll(async () => {
        await TestsHelper.deleteAccount(app.getHttpServer(), userToken);
    });

    it("basic lookup - then should return 200 (Ok)", async () => {
        const res = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toEqual(HttpStatus.OK);
        expect(res.body).toBeDefined();
        expect(res.body.length).toEqual(nb);
        res.body.map(p => {
           expect(p.id).toBeDefined();
           expect(p.armyList1).toBeDefined();
           expect(p.armyList2).toBeDefined();
           expect(p.player1Score).toBeDefined();
           expect(p.player2Score).toBeDefined();
        });
    });

    it("invalid token - then should return 401 (Unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
});
