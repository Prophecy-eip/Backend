import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { TestsHelper } from "../../tests.helper";
import * as request from "supertest";

let app: INestApplication;

describe("account/reset-password", () => {
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    it("null parameter - should return 400 (Bad Request)", async () => {
        const res = await request(app.getHttpServer())
            .put(TestsHelper.RESET_PASSWORD_ROUTE)
            .send(null);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined parameter - should return 400 (Bad Request)", async () => {
        const res = await request(app.getHttpServer())
            .put(TestsHelper.RESET_PASSWORD_ROUTE)
            .send(undefined);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined password - should return 400 (Bad Request)", async () => {
        const res = await request(app.getHttpServer())
            .put(TestsHelper.RESET_PASSWORD_ROUTE)
            .send({ password: undefined });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null password - should return 400 (Bad Request)", async () => {
        const res = await request(app.getHttpServer())
            .put(TestsHelper.RESET_PASSWORD_ROUTE)
            .send({ password: null });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("empty password - should return 400 (Bad Request)", async () => {
        const res = await request(app.getHttpServer())
            .put(TestsHelper.RESET_PASSWORD_ROUTE)
            .send({ password: "" });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
});
