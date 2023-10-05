import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { TestsHelper } from "../../tests.helper";
import * as request from "supertest";

let app: INestApplication;

describe("account/send-password-reset-link", () => {
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
            .post(TestsHelper.SEND_PASSWORD_RESET_LINK_ROUTE)
            .send(null);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined parameter - should return 400 (Bad Request)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.SEND_PASSWORD_RESET_LINK_ROUTE)
            .send(undefined);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined email - should return 400 (Bad Request)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.SEND_PASSWORD_RESET_LINK_ROUTE)
            .send({ email: undefined });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null email - should return 400 (Bad Request)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.SEND_PASSWORD_RESET_LINK_ROUTE)
            .send({ email: null });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("empty email - should return 400 (Bad Request)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.SEND_PASSWORD_RESET_LINK_ROUTE)
            .send({ email: "" });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("not email email - should return 400 (Bad Request)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.SEND_PASSWORD_RESET_LINK_ROUTE)
            .send({ email: "abcdef" });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
});
