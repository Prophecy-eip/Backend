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

describe("account/update-password", () => {

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

    it("update password - should return 200 (OK)", async () => {
        // creating account
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_PASSWORD_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
                password: PASSWORD1
            });

        expect(response1.status).toEqual(HttpStatus.OK);

        // sign in with new password
        const [response2] = await Promise.all([request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: USERNAME,
                password: PASSWORD1
            })]);

        return expect(response2.status).toEqual(HttpStatus.OK);

        // sign in with old password
        const response3 = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: USERNAME,
                password: PASSWORD
            });

        expect(response3.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("empty password - should return 400 (Bad Request)", async () => {
        // creating account
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_PASSWORD_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
                password: ""
            });

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined password - should return 400 (Bad Request)", async () => {
        // creating account
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_PASSWORD_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({ password: undefined });

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null password - should return 400 (Bad Request)", async () => {
        // creating account
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_PASSWORD_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({ password: null });

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null parameter - should return 400 (Bad Request)", async () => {
        // creating account
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_PASSWORD_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send(null);

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined parameter - should return 400 (Bad Request)", async () => {
        // creating account
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_PASSWORD_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send(undefined);

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });
});
