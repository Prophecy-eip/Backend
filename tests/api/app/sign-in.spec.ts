import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { TestsHelper } from "../../tests.helper";
import { AppModule } from "../../../src/app.module";

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

let app: INestApplication;

describe("/sign-in", () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        await TestsHelper.createAccountAndGetToken(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);
    });

    afterAll(async () => {
        let token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);
        await TestsHelper.deleteAccount(app.getHttpServer(), token, PASSWORD);

        token = await TestsHelper.getToken(app.getHttpServer(), USERNAME1, PASSWORD);
        await TestsHelper.deleteAccount(app.getHttpServer(), token, PASSWORD);

        token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD1);
        await TestsHelper.deleteAccount(app.getHttpServer(), token, PASSWORD1);
    });

    it("existing username and valid password - should return 200 (OK)", async () => {
        // logging in
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: USERNAME,
                password: PASSWORD
            });

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.username !== null);
        expect(response.body.username !== undefined);
        expect(response.body.username !== "");
        expect(response.body.username === USERNAME);
        expect(response.body.access_token !== null);
        expect(response.body.access_token !== undefined);
        expect(response.body.access_token !== "");
    });

    it("existing email and valid password - should return 200 (OK)", async () => {
        // logging in
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: EMAIL,
                password: PASSWORD
            });
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.username).toBeDefined();
        expect(response.body.username).toEqual(USERNAME);
        expect(response.body.access_token).toBeDefined();
    });

    it("existing username and invalid password - should return 401 (Unauthorized)", async () => {
        // logging in with invalid password
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: USERNAME,
                password: PASSWORD1
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("existing email and invalid password- should return 401 (Unauthorized)", async () => {
        // logging in with invalid password
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: EMAIL,
                password: PASSWORD1
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("invalid username - should return 401 (Unauthorized)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: USERNAME1,
                password: PASSWORD
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("invalid email - should return 401 (Unauthorized)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: EMAIL1,
                password: PASSWORD
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("empty username - should return 401 (Unauthorized)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: "",
                password: "password"
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("Login with empty password - should return 401 (Unauthorized)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: "username",
                password: ""
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("undefined username - should return 401 (Unauthorized)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: undefined,
                password: "password"
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("null username - should return 401 (Unauthorized)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: null,
                password: "password"
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("undefined password - should return 401 (Unauthorized)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: "username",
                password: undefined
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("null password - should return 401 (Unauthorized)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: "username",
                password: null
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
});
