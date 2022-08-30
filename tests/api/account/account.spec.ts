import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import {response} from "express";

const SIGNUP_ROUTE: string = "/account/sign-up";
const SIGNIN_ROUTE: string = "/account/sign-in";

class SignInCredentials {
    username: string;
    password: string;
}

describe("Account Controller", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    /**
     * SIGN UP
     */

    it("sign-up: Create an account", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                    username: "username",
                    email: "email@prophecy.com",
                    password: "password"
            })
            .expect(HttpStatus.CREATED);
    });

    it("sign-up: Create an account with already used username", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username",
                email: "email1@prophecy.com",
                password: "password"
            })
            .expect(HttpStatus.CONFLICT);
    });

    it("sign-up: Create an account with already used email", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                email: "email@prophecy.com",
                password: "password"
            })
            .expect(HttpStatus.CONFLICT);
    });

    it("sign-up: Create an account without username", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                email: "email1@prophecy.com",
                password: "password"
            })
            .expect(HttpStatus.BAD_REQUEST);
    });

    it("sign-up: Create an account without email", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                password: "password"
            })
            .expect(HttpStatus.BAD_REQUEST);
    });


    it("sign-up: Create an account without password", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                email: "email1@prophecy.com"
            })
            .expect(HttpStatus.BAD_REQUEST);
    });


    it("sign-up: Create an account with empty username", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "",
                email: "email1@prophecy.com",
                password: "password"
            })
            .expect(HttpStatus.BAD_REQUEST);
    });

    it("sign-up: Create an account with empty email", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                email: "",
                password: "password"
            })
            .expect(HttpStatus.BAD_REQUEST);
    });

    it("sign-up: Create an account with empty password", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                email: "email1@prophecy.com",
                password: ""
            })
            .expect(HttpStatus.BAD_REQUEST);
    });

    /**
     * SIGN IN
     */

    it("sign-in: Login with existing username and valid password", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "username",
                password: "password"
        });
        expect(response.status === HttpStatus.OK);
        expect(response.body.username !== null);
        expect (response.body.username !== undefined);
        expect (response.body.username !== "");
        expect (response.body.username === "username");
        expect(response.body.access_token !== null);
        expect (response.body.access_token !== undefined);
        expect (response.body.access_token !== "");
    });

    it("sign-in: Login with existing email and valid password", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "email@prophecy.com",
                password: "password"
        });
        expect(response.status === HttpStatus.OK);
        expect(response.body.username !== null);
        expect (response.body.username !== undefined);
        expect (response.body.username !== "");
        expect (response.body.username === "username");
        expect(response.body.access_token !== null);
        expect (response.body.access_token !== undefined);
        expect (response.body.access_token !== "");
    });

    it("sign-in: Login with existing username and invalid password", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "username",
                password: "password1"
            });
        expect(response.status === HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with existing email and invalid password", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "email@prophecy.com",
                password: "password1"
            });
        expect(response.status === HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with invalid username", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "username1",
                password: "password"
            });
        expect(response.status === HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with invalid username", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "username1",
                password: "password"
            });
        expect(response.status === HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with invalid email", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "email1@prophecy.com",
                password: "password"
            });
        expect(response.status === HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with empty username", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "",
                password: "password"
            });
        expect(response.status === HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login with empty password", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "username",
                password: ""
            });
        expect(response.status === HttpStatus.UNAUTHORIZED);
    });

    it("sign-in: Login without username", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                password: "password"
            });
        expect(response.status === HttpStatus.BAD_REQUEST);
    });

    it("sign-in: Login without password", async () => {
        const response = await request(app.getHttpServer())
            .post(SIGNIN_ROUTE)
            .send({
                username: "username",
            });
        expect(response.status === HttpStatus.BAD_REQUEST);
    });
})
