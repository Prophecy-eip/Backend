import { Test, TestingModule } from "@nestjs/testing";
import {HttpCode, HttpStatus, INestApplication} from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';

const SIGNUP_ROUTE: string = "/account/sign-up";
const SIGNIN_ROUTE: string = "/account/sign-in";
const SIGNOUT_ROUTE: string = "/account/sign-out";
const DELETE_ACCOUNT_ROUTE: string = "/account/settings/delete-account";
const UPDATE_PASSWORD_ROUTE: string = "/account/settings/update-password";
const UPDATE_EMAIL_ROUTE: string = "/account/settings/update-email-address";

const USERNAME = "username";
const EMAIL = "email@prophecy.com";
const PASSWORD = "password";

const USERNAME1 = "username1";
const EMAIL1 = "email1@prophecy.com";
const PASSWORD1 = "password1";

describe("Account Route", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();

        let token = await getToken(USERNAME, PASSWORD);

        await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        token = await getToken(USERNAME1, PASSWORD);

        await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        token = await getToken(USERNAME, PASSWORD1);

        await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);
    });

    afterEach(async () => {
        let token = await getToken(USERNAME, PASSWORD);

        await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        token = await getToken(USERNAME1, PASSWORD);

        await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        token = await getToken(USERNAME, PASSWORD1);

        await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);
    })

    async function getToken(id: string, password: string): Promise<string> {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: id,
                password: password
            });
        return response.body.access_token;
    }

    async function signUp(username, email, password) {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: username,
                email: email,
                password: password
            });
    }

    /**
     * SIGN UP
     */

    it("sign-up: Create an account", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: USERNAME,
                email: EMAIL,
                password: PASSWORD
            });

        expect(response.status).toEqual(HttpStatus.CREATED);
    });

    it("sign-up: Create an account with already used username", async () => {
        // creating a first account
        const r = await signUp(USERNAME, EMAIL, PASSWORD)

        expect(r.status).toEqual(HttpStatus.CREATED);

        // creating a second account with the same username
        const response = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: USERNAME,
                email: EMAIL1,
                password: PASSWORD
            });

        expect(response.status).toEqual(HttpStatus.CONFLICT);
    });

    it("sign-up: Create an account with already used EMAIL", async () => {
        // creating a first account
        const r = await signUp(USERNAME, EMAIL, PASSWORD)

        expect(r.status).toEqual(HttpStatus.CREATED);

        // creating a second account with the same EMAIL address
        const response = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: USERNAME1,
                email: EMAIL,
                password: PASSWORD
            });

        expect(response.status).toEqual(HttpStatus.CONFLICT);
    });

    it("sign-up: Create an account without username", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                email: "email1@prophecy.com",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("sign-up: Create an account without EMAIL", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });


    it("sign-up: Create an account without password", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                email: "email1@prophecy.com"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });


    it("sign-up: Create an account with empty username", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "",
                email: "email1@prophecy.com",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("sign-up: Create an account with empty EMAIL", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                email: "",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("sign-up: Create an account with empty password", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
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
        // creating account
        const r = await signUp(USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // logging in
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
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
        // creating account
        const r = await signUp(USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // logging in
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
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
        // creating account
        const r = await signUp(USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);
        // logging in with invalid password
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: USERNAME,
                password: PASSWORD1
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with existing EMAIL and invalid password", async () => {
        // creating account
        const r = await signUp(USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // logging in with invalid password
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: EMAIL,
                password: PASSWORD1
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with invalid username", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: USERNAME1,
                password: PASSWORD
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with invalid EMAIL", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: EMAIL1,
                password: PASSWORD
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with empty username", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "",
                password: "password"
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with empty password", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "username",
                password: ""
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login without username", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                password: "password"
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login without password", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "username",
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    /**
     * SIGN OUT
     */

    it("sign-out: Logout with valid token", async () => {
        // creating account
        const r = await signUp(USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await getToken(USERNAME, PASSWORD);

        // logging out
        const response = await request(app.getHttpServer())
            .post(SIGNOUT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(HttpStatus.OK);
    });

    it("sign-out: Logout with invalid token", async () => {
        const token = "token";

        const response = await request(app.getHttpServer())
            .post(SIGNOUT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    /**
     * SETTINGS DELETE ACCOUNT
     */

    it("settings/delete-account: Delete existing account", async () => {
        // creating account
        const r = await signUp(USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await getToken("username", "password");

        // deleting account
        const response1 = await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response1.status == HttpStatus.OK);

        // trying to login
        const response2 = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "username",
                password: "password",
            });

        expect(response2.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("settings/delete-account: Delete with invalid token", async () => {
        const token = "token"

        const response1 = await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response1.status == HttpStatus.UNAUTHORIZED);
    });

    it("settings/delete-account: Delete not existing account", async () => {
        const response1 = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: USERNAME,
                email: EMAIL,
                password: PASSWORD
            });

        expect(response1.status).toEqual(HttpStatus.CREATED);

        const response2 = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "username",
                password: "password",
            });

        expect(response2.status).toEqual(HttpStatus.OK);

        const token = response2.body.access_token;

        const response3 = await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response3.status == HttpStatus.OK);

        const response4 = await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response4.status == HttpStatus.UNAUTHORIZED);
    })

    /**
     * SETTINGS UPDATE PASSWORD
     */

    it("settings/update-password: Update password", async () => {
        // creating account
        const r = await signUp(USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await getToken(USERNAME, PASSWORD);

        const response1 = await request(app.getHttpServer())
            .put(UPDATE_PASSWORD_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
                password: PASSWORD1
            });

        expect(response1.status).toEqual(HttpStatus.OK);

        // sign in with new password
        const [response2] = await Promise.all([request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: USERNAME,
                password: PASSWORD1
            })]);

        return expect(response2.status).toEqual(HttpStatus.OK);

        // sign in with old password
        const response3 = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: USERNAME,
                password: PASSWORD
            });

        expect(response3.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("settings/update-password: Update password with empty password", async () => {
        // creating account
        const r = await signUp(USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await getToken(USERNAME, PASSWORD);

        const response1 = await request(app.getHttpServer())
            .put(UPDATE_PASSWORD_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
                password: ""
            });

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("settings/update-password: Update password without password", async () => {
        // creating account
        const r = await signUp(USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await getToken(USERNAME, PASSWORD);

        const response1 = await request(app.getHttpServer())
            .put(UPDATE_PASSWORD_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * UPDATE EMAIL ADDRESS
     */

    it("settings/update-email-address: Update email", async () => {
        const r = await signUp(USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await getToken(USERNAME, PASSWORD);

        // updating email
        const response1 = await request(app.getHttpServer())
            .put(UPDATE_EMAIL_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: EMAIL1
            });

        expect(response1.status).toEqual(HttpStatus.OK);

        // trying to sign in with the old email
        const response2 = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: EMAIL,
                password: PASSWORD
            });

        expect(response2.status).toEqual(HttpStatus.UNAUTHORIZED);

        // trying to sign in with the new email
        const response3 = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: EMAIL1,
                password: PASSWORD
            });

        expect(response3.status).toEqual(HttpStatus.OK);
        expect(response3.body.username).toBeDefined();
        expect(response3.body.username).toEqual(USERNAME);
    });

    it("settings/update-email-address: Update email with empty email", async () => {
        const r = await signUp(USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await getToken(USERNAME, PASSWORD);

        // updating email
        const response1 = await request(app.getHttpServer())
            .put(UPDATE_EMAIL_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: ""
            });

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("settings/update-email-address: Update email without email", async () => {
        const r = await signUp(USERNAME, EMAIL, PASSWORD);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await getToken(USERNAME, PASSWORD);

        // updating email
        const response1 = await request(app.getHttpServer())
            .put(UPDATE_EMAIL_ROUTE)
            .set("Authorization", `Bearer ${token}`)
            .send({
            });

        expect(response1.status).toEqual(HttpStatus.BAD_REQUEST);
    });
})
