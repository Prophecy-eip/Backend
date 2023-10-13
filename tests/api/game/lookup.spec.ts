import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";

import { AppModule } from "../../../src/app.module";
import { TestsHelper } from "../../tests.helper";
import { ARMY1, ARMY2 } from "../../fixtures/army-list/armies-lists";

jest.setTimeout(55000)

const OWNER_USERNAME = faker.internet.userName();
const OWNER_EMAIL = faker.internet.email();
const OWNER_PASSWORD = faker.internet.email();

const OPPONENT_USERNAME = faker.internet.userName();
const OPPONENT_EMAIL = faker.internet.email();
const OPPONENT_PASSWORD = faker.internet.email();

let app: INestApplication;
let ownerToken: string;
let opponentToken: string;
let ownerArmyListId: string;
let opponentArmyListId: string;
let nb: number;

describe("Games route", () => {

    beforeAll(async () => {
        // app initialization
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();

        // crating accounts and retrieving tokens
        ownerToken = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), OWNER_USERNAME, OWNER_EMAIL, OWNER_PASSWORD);
        opponentToken = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), OPPONENT_USERNAME, OPPONENT_EMAIL, OPPONENT_PASSWORD);

        // creating armies lists
        await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`).send(ARMY1);
        ownerArmyListId = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`).then(res => res.body[0]?.id);

        await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`).send(ARMY2);
        opponentArmyListId = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`).then(res => res.body[0].id);

        nb = Math.floor(Math.random() * 9) + 1;
        for (let i = 0; i < nb; ++i) {
            const res = await request(app.getHttpServer())
                .post(TestsHelper.GAMES_ROUTE)
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({
                    opponent: OPPONENT_USERNAME,
                    ownerScore: 15,
                    opponentScore: 5,
                    ownerArmyListId,
                    opponentArmyListId
                });
        }

    });

    afterAll(async () => {
        // deleting accounts
        await TestsHelper.deleteAccount(app.getHttpServer(), opponentToken, OPPONENT_PASSWORD);
        await TestsHelper.deleteAccount(app.getHttpServer(), ownerToken, OWNER_PASSWORD);
    });

    it("basic lookup - then should return 200 (OK)", async () => {
        const res = await request(app.getHttpServer())
            .get(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`);

        expect(res.status).toEqual(HttpStatus.OK);
        expect(res.body.length).toEqual(nb);
        res.body.map((p) => {
            expect(p.id).toBeDefined();
            expect(p.opponent).toBeDefined();
            expect(p.ownerScore).toBeDefined();
            expect(p.opponentScore).toBeDefined();
            expect(p.ownerArmyList).toBeDefined();
            expect(p.opponentArmyList).toBeDefined();
        })
    })

    it("invalid token - then should return 401 (Unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .get(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    })
});
