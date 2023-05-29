import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { faker } from "@faker-js/faker";

import { AppModule } from '../../../src/app.module';
import { TestsHelper } from "../../tests.helper";

// const SIGNUP_ROUTE: string = "/account/sign-up";
// const SIGNIN_ROUTE: string = "/account/sign-in";
// const SIGNOUT_ROUTE: string = "/account/sign-out";
// const DELETE_ACCOUNT_ROUTE: string = "/account/settings/delete-account";
// const UPDATE_PASSWORD_ROUTE: string = "/account/settings/update-password";
// const UPDATE_EMAIL_ROUTE: string = "/account/settings/update-email-address";
// const UPDATE_USERNAME_ROUTE: string = "/account/settings/update-username";

// const USERNAME = "username";
// const EMAIL = "email@prophecy.com";
// const PASSWORD = "password";
//
// const USERNAME1 = "username1";
// const EMAIL1 = "email1@prophecy.com";
// const PASSWORD1 = "password1";

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

// TODO

describe("Account Route", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
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

    /**
     * SETTINGS DELETE ACCOUNT
     */

    it("settings/delete-account: Delete existing account", async () => {
        // creating account
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // deleting account
        const response1 = await TestsHelper.deleteAccount(app.getHttpServer(), token);

        expect(response1.status == HttpStatus.OK);

        // trying to login
        const response2 = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: USERNAME,
                password: PASSWORD,
            });

        expect(response2.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("settings/delete-account: Delete with invalid token", async () => {
        const token = "token"
        const response1 = await TestsHelper.deleteAccount(app.getHttpServer(), token)

        expect(response1.status == HttpStatus.UNAUTHORIZED);
    });

    it("settings/delete-account: Delete not existing account", async () => {
        const response1 = await TestsHelper.signUp(app.getHttpServer(), USERNAME1, EMAIL1, PASSWORD1);

        expect(response1.status).toEqual(HttpStatus.CREATED);

        const response2 = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_IN_ROUTE)
            .send({
                username: USERNAME1,
                password: PASSWORD1,
            });

        expect(response2.status).toEqual(HttpStatus.OK);

        const token = response2.body.access_token;

        const response3 = await TestsHelper.deleteAccount(app.getHttpServer(), token);

        expect(response3.status == HttpStatus.OK);

        const response4 = await TestsHelper.deleteAccount(app.getHttpServer(), token);

        expect(response4.status == HttpStatus.UNAUTHORIZED);
    })

    /**
     * SETTINGS UPDATE PASSWORD
     */

    it("settings/update-password: Update password", async () => {
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

    it("settings/update-password: Update password with empty password", async () => {
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

    it("settings/update-password: Update password without password", async () => {
        // creating account
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_PASSWORD_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * UPDATE EMAIL ADDRESS
     */

    it("settings/update-email-address: Update email", async () => {
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

    it("settings/update-email-address: Update email with empty email", async () => {
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

    it("settings/update-email-address: Update email without email", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating email
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_EMAIL_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
            });

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * UPDATE USERNAME
     */

    it("settings/update-username: Update username", async () => {
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

    it("settings/update-username: Update username with empty username", async () => {
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

    it("settings/update-username: Update username without username", async () => {
        const r = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);

        // updating username
        const response1 = await request(app.getHttpServer())
            .put(TestsHelper.UPDATE_USERNAME_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });
})
