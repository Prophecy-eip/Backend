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

describe("/sign-out", () => {

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

    it("logout with valid token - should return 200 (OK)", async () => {
        // retrieving token
        const token = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), USERNAME, EMAIL, PASSWORD);

        // logging out
        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_OUT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(HttpStatus.OK);
    });

    it("invalid token - should return 401 (Unauthorized)", async () => {
        const token = "token";

        const response = await request(app.getHttpServer())
            .post(TestsHelper.SIGN_OUT_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
});
