import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { TestsHelper } from "../../tests.helper";
import * as request from "supertest";
import { ARMY1, ARMY2 } from "../../fixtures/army-list/armies-lists";
import { PROPHECY_UNIT_REQUEST } from "../../fixtures/prophecy/prophecy";

jest.setTimeout(40000);

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

let app: INestApplication;

describe("account/update-username", () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterEach(async () => {
        let token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);
        await TestsHelper.deleteAccount(app.getHttpServer(), token, PASSWORD);

        token = await TestsHelper.getToken(app.getHttpServer(), USERNAME1, PASSWORD);
        await TestsHelper.deleteAccount(app.getHttpServer(), token, PASSWORD);

        token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD1);
        await TestsHelper.deleteAccount(app.getHttpServer(), token, PASSWORD1);
    });

    it("update username - should return 200 (OK)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating username
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_USERNAME_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: USERNAME1
            });

        expect(response1.status).toEqual(HttpStatus.OK);
        expect(response1.body.username).toBeDefined();
        expect(response1.body.access_token).toBeDefined();
        expect(response1.body.username).toEqual(USERNAME1);

        // trying to sign in with old username
        const response2 = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: USERNAME,
                password: PASSWORD
            });

        expect(response2.status).toEqual(HttpStatus.UNAUTHORIZED);

        // logging in with the new username
        const response3 = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: USERNAME1,
                password: PASSWORD
            });

        expect(response3.status).toEqual(HttpStatus.OK);

        // try to update email with old token
        const response4 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_EMAIL_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: EMAIL1
            });

        expect(response4.status).toEqual(HttpStatus.OK);
    });

    it("empty username - should return 400 (Bad Request)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating username
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_USERNAME_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: ""
            });

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null parameter - should return 400 (Bad Request)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating username
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_USERNAME_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send(null);

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined parameter - should return 400 (Bad Request)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating username
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_USERNAME_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send(undefined);

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined username - should return 400 (Bad Request)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating username
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_USERNAME_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({ username: undefined });

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null username - should return 400 (Bad Request)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating username
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_USERNAME_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({ username: null });

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("update with armies lists and prophecies - should return 200 (OK)", async () => {
       const token1: string = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(token1).toBeDefined();

       // create armise lists
        const armyListId1: string = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token1}`).send(ARMY1).then(res => res.body.id);
        const armyListId2: string = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token1}`).send(ARMY2).then(res => res.body.id);

        // create army prophecy
        const prophecyArmyId = await request(app.getHttpServer())
            .post(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token1}`).send({
                armyList1: armyListId1,
                armyList2: armyListId2
            }).then(res => res.body.id);

       // create unit prophecy
        await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token1}`).send(PROPHECY_UNIT_REQUEST);

        // update username
        const updateResponse = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_USERNAME_ROUTE)
            .set("Authorization", `Bearer ${token1}`)
            .send({ username: USERNAME1 });


        expect(updateResponse.status).toEqual(HttpStatus.OK);
        expect(updateResponse.body.username).toBeDefined()
        expect(updateResponse.body.username).toEqual(USERNAME1);
        expect(updateResponse.body.access_token).toBeDefined();

        const token2 = updateResponse.body.access_token;

        // check that armies lists still exist
        const armiesListsLookupResponse = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token2}`);

        expect(armiesListsLookupResponse.status).toEqual(HttpStatus.OK);
        expect(armiesListsLookupResponse.body.length).toEqual(2);
        expect(armiesListsLookupResponse.body.find(e => e.id === armyListId1)).toBeDefined();
        expect(armiesListsLookupResponse.body.find(e => e.id === armyListId2)).toBeDefined();

        // check that armies prophecies still exist
        const armiesPropheciesLookupResponse = await request(app.getHttpServer())
            .get(TestsHelper.ARMY_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token2}`);

        expect(armiesPropheciesLookupResponse.status).toEqual(HttpStatus.OK);
        expect(armiesPropheciesLookupResponse.body.length).toEqual(1);
        expect(armiesPropheciesLookupResponse.body[0].id).toEqual(prophecyArmyId);

        // check that unit prophecies still exist
        const unitsPropheciesLookupResponse = await request(app.getHttpServer())
            .get(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token2}`);

        expect(unitsPropheciesLookupResponse.status).toEqual(HttpStatus.OK);
        expect(unitsPropheciesLookupResponse.body.length).toEqual(1);
    });
});
