import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';

let app: INestApplication;

const ARMIES = "/armies";
const LOOKUP_ROOT = ARMIES + "/lookup";
const FAKE_ID: number = 12345;
const INVALID_ID: string = "12345678910111213";

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
            .get(LOOKUP_ROOT);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.length).toBeGreaterThan(0);
        for (const it of response.body) {
            expect(it.id).toBeDefined();
            expect(it.name).toBeDefined();
        }
    });

    // it(":id: Retrieve existing army's data", async () => {
    //     const credentials = await request(app.getHttpServer())
    //         .get(LOOKUP_ROOT);
    //     const id: string = credentials.body[0].id;
    //     const name: string = credentials.body[0].name;
    //     const response = await request(app.getHttpServer())
    //         .get(`/armies/${id}`);
    //
    //     expect(response.status).toEqual(HttpStatus.OK);
    //     expect(response.body).toBeDefined();
    //     expect(response.body.name).toEqual(name);
    //     expect(response.body.id).toEqual(id);
    //     expect(response.body.unitCategories).toBeDefined();
    //     expect(response.body.units).toBeDefined();
    //     expect(response.body.rules).toBeDefined();
    //     expect(response.body.upgradeCategories).toBeDefined();
    //     expect(response.body.upgrades).toBeDefined();
    //     expect(response.body.specialItemCategories).toBeDefined();
    //     expect(response.body.options).toBeDefined();
    // });

    it(":id: Try to retrieve not existing army's data", async () => {
        const response = await request(app.getHttpServer())
            .get(`/armies/${FAKE_ID}`);

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(":id: Use invalid id type - then should return Bad Request (400)", async () => {
        const response = await request(app.getHttpServer())
            .get(`/armies/${INVALID_ID}`);

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });
});
