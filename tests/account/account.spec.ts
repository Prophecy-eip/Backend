import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';


describe("Account Controller", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it("sign-up", () => {
        return request(app.getHttpServer())
        .post("/account/sign-up")
        .send({
                username: "username",
                email: "email@prophecy.com",
                password: "password"
        })
        .expect(HttpStatus.CREATED);
    })
})