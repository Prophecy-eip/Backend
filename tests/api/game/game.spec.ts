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

    afterAll(async () => {
        // deleting accounts
        await TestsHelper.deleteAccount(app.getHttpServer(), opponentToken);
        await TestsHelper.deleteAccount(app.getHttpServer(), ownerToken);
    });

    /**
     * CREATE
     */
    it("create: opponent, armies lists - then should return 201 (created)", async() => {
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

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("create: opponent, null opponent army list - then should return 201 (created)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 15,
                opponentScore: 5,
                ownerArmyListId,
                opponentArmyListId: null
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("create: opponent, null owner army list - then should return 201 (created)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 15,
                opponentScore: 5,
                ownerArmyListId: null,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("create: null opponent, armies lists - then should return 201 (created)", async() => {
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

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("create: null opponent, null opponent army list - then should return 201 (created)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: null,
                ownerScore: 15,
                opponentScore: 5,
                ownerArmyListId,
                opponentArmyListId: null
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("create: null opponent, null owner army list - then should return 201 (created)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: null,
                ownerScore: 15,
                opponentScore: 5,
                ownerArmyListId: null,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("create: null opponent, null armies lists - then should return 201 (created)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 15,
                opponentScore: 5,
                ownerArmyListId: null,
                opponentArmyListId: null
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("create: total score under 20 - then should return 400 (bad request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 12,
                opponentScore: 5,
                ownerArmyListId: ownerArmyListId,
                opponentArmyListId: opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("create: total score over 20 - then should return 400 (bad request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 15,
                opponentScore: 9,
                ownerArmyListId: ownerArmyListId,
                opponentArmyListId: opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("create: no opponentId - then should return 400 (bad request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                ownerScore: 15,
                opponentScore: 9,
                ownerArmyListId: ownerArmyListId,
                opponentArmyListId: opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("create: no ownerScore - then should return 400 (bad request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                opponentScore: 9,
                ownerArmyListId: ownerArmyListId,
                opponentArmyListId: opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("create: no opponentScore - then should return 400 (bad request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 15,
                ownerArmyListId: ownerArmyListId,
                opponentArmyListId: opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("create: no ownerArmyListId - then should return 400 (bad request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 15,
                opponentScore: 9,
                opponentArmyListId: opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("create: no opponentArmyListId - then should return 400 (bad request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 15,
                opponentScore: 9,
                ownerArmyListId: ownerArmyListId,
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("create: invalid token - then should return 401 (unauthorized)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer abcdef`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 15,
                opponentScore: 9,
                ownerArmyListId: ownerArmyListId,
                opponentArmyListId: opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("create: invalid opponentId - then should return 404 (not found)", async() => {
        const username: string = faker.internet.userName();
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: username,
                ownerScore: 15,
                opponentScore: 5,
                ownerArmyListId: null,
                opponentArmyListId: null
            });

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("create: invalid ownerArmyListId - then should return 404 (not found)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 15,
                opponentScore: 5,
                ownerArmyListId: "abcd",
                opponentArmyListId: opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("create: invalid opponentArmyListId - then should return 404 (not found)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 15,
                opponentScore: 9,
                ownerArmyListId: ownerArmyListId,
                opponentArmyListId: "efgh"
            });

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });
});
