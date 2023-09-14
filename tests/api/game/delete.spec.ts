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
let opponentArmyListId:string;
let gameId: string;

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

    });

    beforeEach(async () => {
        await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 15,
                opponentScore: 5,
                ownerArmyListId,
                opponentArmyListId
            });

        gameId = await request(app.getHttpServer())
            .get(TestsHelper.GAMES_ROUTE).set("Authorization", `Bearer ${ownerToken}`).then(res => res.body[0].id);
    });

    afterAll(async () => {
        // deleting accounts
        await TestsHelper.deleteAccount(app.getHttpServer(), opponentToken);
        await TestsHelper.deleteAccount(app.getHttpServer(), ownerToken);
    });

    it("basic delete - then should return 200 (OK)", async() => {
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.GAMES_ROUTE}/${gameId}`)
            .set("Authorization", `Bearer ${ownerToken}`);

        expect(res.status).toEqual(HttpStatus.OK);
        const games = await request(app.getHttpServer())
            .get(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .then(res => res.body);

        // console.log(games)
        games.map(g => expect(g.id !== gameId));

    });

    it("invalid token - then should return 401 (Unauthorized)", async() => {
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.GAMES_ROUTE}/${gameId}`)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("Unahthorized user - then should return 403 (Forbidden)", async() => {
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.GAMES_ROUTE}/${gameId}`)
            .set("Authorization", `Bearer ${opponentToken}`);

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("Not existing  game - then should return 404 (Not found)", async() => {
        const res = await request(app.getHttpServer())
            .delete(`${TestsHelper.GAMES_ROUTE}/abcd`)
            .set("Authorization", `Bearer ${ownerToken}`);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

});
