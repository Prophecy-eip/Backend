import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "@app/app.module";
import * as request from "supertest";
import { TestsHelper } from "@tests/tests.helper";

jest.setTimeout(10000);

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

describe("Root route", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        let token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        await TestsHelper.deleteAccount(app.getHttpServer(), token);

        token = await TestsHelper.getToken(app.getHttpServer(), USERNAME1, PASSWORD);

        await request(app.getHttpServer())
            .delete(TestsHelper.DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD1);

        await request(app.getHttpServer())
            .delete(TestsHelper.DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);
    });


    /**
     * SIGN UP
     */

    it("sign-up: Create an account", async () => {
        const response = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD)

        expect(response.status).toEqual(HttpStatus.CREATED);
    });

    it("sign-up: Create an account with already used username", async () => {
       const response = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL1, PASSWORD);

        expect(response.status).toEqual(HttpStatus.CONFLICT);
    });

    it("sign-up: Create an account with already used EMAIL", async () => {
        const response = await TestsHelper.signUp(app.getHttpServer(), USERNAME1, EMAIL, PASSWORD);

        expect(response.status).toEqual(HttpStatus.CONFLICT);
    });

    it("sign-up: Create an account without username", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                email: "email1@prophecy.com",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("sign-up: Create an account without EMAIL", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "username1",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });


    it("sign-up: Create an account without password", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "username1",
                email: "email1@prophecy.com"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });


    it("sign-up: Create an account with empty username", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "",
                email: "email1@prophecy.com",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("sign-up: Create an account with empty EMAIL", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "username1",
                email: "",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("sign-up: Create an account with empty password", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "username1",
                email: "email1@prophecy.com",
                password: ""
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * SIGN IN
     */

    it("sign-in: Login with existing username and valid password", async () => {
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

    it("sign-in: Login with existing EMAIL and valid password", async () => {
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

    it("sign-in: Login with existing username and invalid password", async () => {
        // logging in with invalid password
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: USERNAME,
                password: PASSWORD1
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with existing EMAIL and invalid password", async () => {
        // logging in with invalid password
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: EMAIL,
                password: PASSWORD1
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with invalid username", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: USERNAME1,
                password: PASSWORD
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with invalid EMAIL", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: EMAIL1,
                password: PASSWORD
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with empty username", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: "",
                password: "password"
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with empty password", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: "username",
                password: ""
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login without username", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                password: "password"
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login without password", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: "username",
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    /**
     * SIGN OUT
     */

    it("sign-out: Logout with valid token", async () => {
        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // logging out
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_OUT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(HttpStatus.OK);
    });

    it("sign-out: Logout with invalid token", async () => {
        const token = "token";

        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_OUT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

});
