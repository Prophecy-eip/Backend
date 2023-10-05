import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { TestsHelper } from "../../tests.helper";
import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

let app: INestApplication;

describe("account/delete", () => {

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

    it("delete existing account - should return 200 (OK)", async () => {
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

    it("invalid token - should return 401 (Unauthorized)", async () => {
        const token = "token"
        const response1 = await TestsHelper.deleteAccount(app.getHttpServer(), token)

        expect(response1.status == HttpStatus.UNAUTHORIZED);
    });

    it("not existing account - should return 401 (Unauthorized)", async () => {
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

});
