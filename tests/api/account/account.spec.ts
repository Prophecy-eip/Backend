import { Test, TestingModule } from "@nestjs/testing";
import {HttpCode, HttpStatus, INestApplication} from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import exp from "constants";

const SIGNUP_ROUTE: string = "/account/sign-up";
const SIGNIN_ROUTE: string = "/account/sign-in";
const SIGNOUT_ROUTE: string = "/account/sign-out";
const DELETE_ACCOUNT_ROUTE: string = "/account/settings/delete-account";
const UPDATE_PASSWORD_ROUTE: string = "/account/settings/update-password";

const username = "username";
const email = "email@prophecy.com";
const password = "password";

const username1 = "username1";
const email1 = "email1@prophecy.com";
const password1 = "password1";

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
        let token = await getToken(username, password);

        await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        token = await getToken(username1, password);

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
                username: "username",
                email: "email@prophecy.com",
                password: "password"
            });
    }

    /**
     * SIGN UP
     */

    it("sign-up: Create an account", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                    username: username,
                    email: email,
                    password: password
            });

        expect(response.status).toEqual(HttpStatus.CREATED);
    });

    it("sign-up: Create an account with already used username", async () => {
        // creating a first account
        const r = await signUp(username, email, password)

        expect(r.status).toEqual(HttpStatus.CREATED);

        // creating a second account with the same username
        const response = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: username,
                email: email1,
                password: password
            });

        expect(response.status).toEqual(HttpStatus.CONFLICT);
    });

    it("sign-up: Create an account with already used email", async () => {
        // creating a first account
        const r = await signUp(username, email, password)

        expect(r.status).toEqual(HttpStatus.CREATED);

        // creating a second account with the same email address
        const response = await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: username1,
                email: email,
                password: password
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

    it("sign-up: Create an account without email", async () => {
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

    it("sign-up: Create an account with empty email", async () => {
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
        const r = await signUp(username, email, password);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // logging in
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: username,
                password: password
        });

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.username !== null);
        expect (response.body.username !== undefined);
        expect (response.body.username !== "");
        expect (response.body.username === username);
        expect(response.body.access_token !== null);
        expect (response.body.access_token !== undefined);
        expect (response.body.access_token !== "");
    });

    it("sign-in: Login with existing email and valid password", async () => {
        // creating account
        const r = await signUp(username, email, password);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // logging in
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "email@prophecy.com",
                password: "password"
        });
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.username).toBeDefined();
        expect (response.body.username).toEqual(username);
        expect (response.body.access_token).toBeDefined();
    });

    it("sign-in: Login with existing username and invalid password", async () => {
        // creating account
        const r = await signUp(username, email, password);

        expect(r.status).toEqual(HttpStatus.CREATED);
        // logging in with invalid password
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: username,
                password: password1
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with existing email and invalid password", async () => {
        // creating account
        const r = await signUp(username, email, password);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // logging in with invalid password
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: email,
                password: password1
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with invalid username", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: username1,
                password: password
            });
        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with invalid email", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: email1,
                password: password
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
        const r = await signUp(username, email, password);

        expect(r.status).toEqual(HttpStatus.CREATED);

        // retrieving token
        const token = await getToken(username, password);

        // logging out
        const response = await request(app.getHttpServer())
            .post(SIGNOUT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(HttpStatus.OK);
    });

    it("sign-out: Logout with invalid token", async () => {
        const token = "token";

        const response = await  request(app.getHttpServer())
            .post(SIGNOUT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    /**
     * SETTINGS DELETE ACCOUNT
     */

    it("settings/delete-account: Delete existing account", async () => {
        const token = await getToken("username", "password");

        const response1 = await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response1.status == HttpStatus.OK);

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
                username: "username",
                email: "email@prophecy.com",
                password: "password"
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

    it("settings/update-password", async () => {
        await request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username",
                email: "email@prophecy.com",
                password: "password"
            });

        const token = getToken("username", "password");

        const response1 = await request(app.getHttpServer())
            .put(UPDATE_PASSWORD_ROUTE)
            .send({
                password: "password1"
        });

        expect(response1.status).toEqual(HttpStatus.OK);

        // sign in with new password
        const [response2] = await Promise.all([request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "username",
                password: "password1"
            })]);

        return expect(response2.status).toEqual(HttpStatus.OK);

        // sign in with old password
        const response3 = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "username",
                password: "password"
            });

        expect(response3.status).toEqual(HttpStatus.UNAUTHORIZED);
    })
})

