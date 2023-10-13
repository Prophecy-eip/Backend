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

describe("games/create", () => {

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
        await TestsHelper.deleteAccount(app.getHttpServer(), opponentToken, OPPONENT_PASSWORD);
        await TestsHelper.deleteAccount(app.getHttpServer(), ownerToken, OWNER_PASSWORD);
        // delete armies lists
        await TestsHelper.deleteArmyList(app.getHttpServer(), ownerToken, ownerArmyListId);
        await TestsHelper.deleteArmyList(app.getHttpServer(), opponentToken, ownerArmyListId);
    });

    it("null parameter - should return 400 (bad request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send(null);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined parameter - should return 400 (bad request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send(undefined);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("all null properties - should return 400 (bad request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: null,
                ownerScore: null,
                opponentScore: null,
                ownerArmyListId: null,
                opponentArmyListId: null
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("all undefined properties - should return 400 (bad request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: undefined,
                ownerScore: undefined,
                opponentScore: undefined,
                ownerArmyListId: undefined,
                opponentArmyListId: undefined
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined opponent - should return 201 (Created)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: undefined,
                ownerScore: 15,
                opponentScore: 5,
                ownerArmyListId,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("undefined opponent - should return 201 (Created)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: null,
                ownerScore: 15,
                opponentScore: 5,
                ownerArmyListId,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("undefined ownerScore - should return 400 (Bad Request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: undefined,
                opponentScore: 5,
                ownerArmyListId,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null ownerScore - should return 400 (Bad Request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: null,
                opponentScore: 5,
                ownerArmyListId,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("<0 ownerScore - should return 400 (Bad Request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: -1,
                opponentScore: 15,
                ownerArmyListId,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it(">20 ownerScore - should return 400 (Bad Request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 21,
                opponentScore: 15,
                ownerArmyListId,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined opponentScore - should return 400 (Bad Request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 5,
                opponentScore: undefined,
                ownerArmyListId,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null opponentScore - should return 400 (Bad Request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 5,
                opponentScore: null,
                ownerArmyListId,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("<0 opponentScore - should return 400 (Bad Request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 5,
                opponentScore: -1,
                ownerArmyListId,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it(">20 opponentScore - should return 400 (Bad Request)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 5,
                opponentScore: 21,
                ownerArmyListId,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null ownerArmyListId - should return 201 (Created)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 5,
                opponentScore: 15,
                ownerArmyListId: null,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("undefined ownerArmyListId - should return 201 (Created)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 5,
                opponentScore: 15,
                ownerArmyListId: undefined,
                opponentArmyListId
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("undefined opponentArmyListId - should return 201 (Created)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 5,
                opponentScore: 15,
                ownerArmyListId,
                opponentArmyListId: undefined
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });


    it("null opponentArmyListId - should return 201 (Created)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 5,
                opponentScore: 15,
                ownerArmyListId,
                opponentArmyListId: null
            });

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("opponent, armies lists - should return 201 (created)", async() => {
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

    it("opponent, null opponent army list - should return 201 (created)", async() => {
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

    it("opponent, null owner army list - should return 201 (created)", async() => {
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

    it("null opponent, armies lists - should return 201 (created)", async() => {
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

    it("null opponent, null opponent army list - should return 201 (created)", async() => {
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

    it("null opponent, null owner army list - should return 201 (created)", async() => {
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

    it("null opponent, null armies lists - should return 201 (created)", async() => {
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

    it("total score under 20 - should return 400 (bad request)", async() => {
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

    it("total score over 20 - should return 400 (bad request)", async() => {
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

    it("no opponentId - should return 400 (bad request)", async() => {
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

    it("no ownerScore - should return 400 (bad request)", async() => {
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

    it("no opponentScore - should return 400 (bad request)", async() => {
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

    it("no ownerArmyListId - should return 400 (bad request)", async() => {
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

    it("no opponentArmyListId - should return 400 (bad request)", async() => {
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

    it("invalid token - should return 401 (unauthorized)", async() => {
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

    it("invalid opponentId - should return 404 (not found)", async() => {
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

    it("invalid ownerArmyListId - should return 404 (not found)", async() => {
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

    it("invalid opponentArmyListId - should return 404 (not found)", async() => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.GAMES_ROUTE)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                opponent: OPPONENT_USERNAME,
                ownerScore: 15,
                opponentScore: 5,
                ownerArmyListId: ownerArmyListId,
                opponentArmyListId: "efgh"
            });

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });


});
