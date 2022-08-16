import { Test, TestingModule } from "@nestjs/testing";
import { HttpCode, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

const ACCOUNT_ROUTE = "/account"

describe("Account Controller", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    })

    it("sign-up", () => {
        return request(app.getHttpServer())
        .post("/account/sign-up")
        .set("username", "username")
        .set("email", "email@prophecy.com")
        .set("password", "password")
        .expect(HttpStatus.CREATED);
    })
})