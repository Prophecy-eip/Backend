import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { TestsHelper } from "../../tests.helper";
import * as request from "supertest";

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

let app: INestApplication;

describe("account/update-email", () => {

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
        await TestsHelper.deleteAccount(app.getHttpServer(), token);

        token = await TestsHelper.getToken(app.getHttpServer(), USERNAME1, PASSWORD);
        await TestsHelper.deleteAccount(app.getHttpServer(), token);

        token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD1);
        await TestsHelper.deleteAccount(app.getHttpServer(), token);
    });

    it("update email - should return 200 (OK)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating email
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_EMAIL_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: EMAIL1
            });

        expect(response1.status).toEqual(HttpStatus.OK);

        // trying to sign in with the old email
        const response2 = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: EMAIL,
                password: PASSWORD
            });

        expect(response2.status).toEqual(HttpStatus.UNAUTHORIZED);

        // trying to sign in with the new email
        const response3 = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: EMAIL1,
                password: PASSWORD
            });

        expect(response3.status).toEqual(HttpStatus.OK);
        expect(response3.body.username).toBeDefined();
        expect(response3.body.username).toEqual(USERNAME);
    });

    it("null parameter - should return 400 (Bad Request)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating email
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_EMAIL_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send(null);

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined parameter - should return 400 (Bad Request)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating email
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_EMAIL_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send(undefined);

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("empty email - should return 400 (Bad Request)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating email
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_EMAIL_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: ""
            });

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("not email email - should return 400 (Bad Request)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating email
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_EMAIL_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: "abcdef"
            });

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null email - should return 400 (Bad Request)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating email
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_EMAIL_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send(null);

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined email - should return 400 (Bad Request)", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating email
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_EMAIL_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send(undefined);

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });
});
