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

describe("/sign-up", () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        let token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD);
        await TestsHelper.deleteAccount(app.getHttpServer(), token, PASSWORD);

        token = await TestsHelper.getToken(app.getHttpServer(), USERNAME1, PASSWORD);
        await TestsHelper.deleteAccount(app.getHttpServer(), token, PASSWORD);

        token = await TestsHelper.getToken(app.getHttpServer(), USERNAME, PASSWORD1);
        await TestsHelper.deleteAccount(app.getHttpServer(), token, PASSWORD1);
    });

    it("create an account - should return 201 (Created)", async () => {
        const response = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL, PASSWORD)

        expect(response.status).toEqual(HttpStatus.CREATED);
    });

    it("already used username - should return 409 (Conflict)", async () => {
        const response = await TestsHelper.signUp(app.getHttpServer(), USERNAME, EMAIL1, PASSWORD);

        expect(response.status).toEqual(HttpStatus.CONFLICT);
    });

    it("already used email - should return 409 (Conflict)", async () => {
        const response = await TestsHelper.signUp(app.getHttpServer(), USERNAME1, EMAIL, PASSWORD);

        expect(response.status).toEqual(HttpStatus.CONFLICT);
    });

    it("null parameter - should return 400 (Bad Request)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send(null);

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined parameter - should return 400 (Bad Request)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send(undefined);

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("all properties undefined - should return 400 (Bad Request)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: undefined,
                email: undefined,
                password: undefined
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("all properties null - should return 400 (Bad Request)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: null,
                email: null,
                password: null
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined username - should return 400 (Bad Request)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: undefined,
                email: "email1@prophecy.com",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null username - should return 400 (Bad Request)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: null,
                email: "email1@prophecy.com",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("empty username - should return 400 (Bad Request)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "",
                email: "email1@prophecy.com",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined email - should return 400 (Bad Request) ", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "username1",
                email: undefined,
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null email - should return 400 (Bad Request) ", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "username1",
                email: null,
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("empty email - should return 400 (Bad Request) ", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "username1",
                email: "",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("not email email - should return 400 (Bad Request) ", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "username1",
                email: "abcdef",
                password: "password"
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined password - should return 400 (Bad Request)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "username1",
                email: "email1@prophecy.com",
                password: undefined
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null password - should return 400 (Bad Request)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "username1",
                email: "email1@prophecy.com",
                password: null
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("empty password - should return 400 (Bad Request)", async () => {
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_UP_ROUTE)
            .send({
                username: "username1",
                email: "email1@prophecy.com",
                password: ""
            });

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });
});
