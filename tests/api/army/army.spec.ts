import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';

let app: INestApplication;

const ARMIES = "/armies";
const LOOKUP_ROOT = ARMIES + "/lookup";

describe("Account Route", () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it("lookup: Retrieve army credentials", async () => {
        const response = await request(app.getHttpServer())
            .get(LOOKUP_ROOT)

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeDefined();
    });
});