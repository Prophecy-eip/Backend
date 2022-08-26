import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';

const SIGNUP_ROUTE: string = "/account/sign-up";

describe("Account Controller", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it("Create an account", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                    username: "username",
                    email: "email@prophecy.com",
                    password: "password"
            })
            .expect(HttpStatus.CREATED);
    });

    it("Create an account with already used username", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username",
                email: "email1@prophecy.com",
                password: "password"
            })
            .expect(HttpStatus.CONFLICT);
    });

    it("Create an account with already used email", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                email: "email@prophecy.com",
                password: "password"
            })
            .expect(HttpStatus.CONFLICT);
    });

    it("Create an account without username", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                email: "email1@prophecy.com",
                password: "password"
            })
            .expect(HttpStatus.BAD_REQUEST);
    });

    it("Create an account without email", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                password: "password"
            })
            .expect(HttpStatus.BAD_REQUEST);
    });


    it("Create an account without password", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                email: "email1@prophecy.com"
            })
            .expect(HttpStatus.BAD_REQUEST);
    });


    it("Create an account with empty username", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "",
                email: "email1@prophecy.com",
                password: "password"
            })
            .expect(HttpStatus.BAD_REQUEST);
    });

    it("Create an account with empty email", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                email: "",
                password: "password"
            })
            .expect(HttpStatus.BAD_REQUEST);
    });

    it("Create an account with empty password", () => {
        return request(app.getHttpServer())
            .post(SIGNUP_ROUTE)
            .send({
                username: "username1",
                email: "email1@prophecy.com",
                password: ""
            })
            .expect(HttpStatus.BAD_REQUEST);
    });

})
