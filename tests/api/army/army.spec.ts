import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from "@app/app.module";

let app: INestApplication;

const ARMIES = "/armies";
const LOOKUP_ROOT = ARMIES + "/lookup";
const FAKE_ID: number = 12345;
const INVALID_ID: string = "12345678910111213";

jest.setTimeout(15000)

// TODO

describe("Account Route", () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    xit("lookup: Retrieve army credentials", async () => {
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

    xit(":id: Retrieve existing army's data", async () => {
        const credentials = await request(app.getHttpServer())
            .get(LOOKUP_ROOT);
        const id: string = credentials.body[0].id;
        const name: string = credentials.body[0].name;
        const response = await request(app.getHttpServer())
            .get(`/armies/${id}`);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.name).toEqual(name);
        expect(response.body.id).toEqual(id);
        expect(response.body.units).toBeDefined();
        expect(response.body.versionId).toBeDefined();
        expect(response.body.categoryId).toBeDefined();
        expect(response.body.source).toBeDefined();
        expect(response.body.equipmentLimits).toBeDefined();
        expect(response.body.specialRuleLimits).toBeDefined();
        expect(response.body.organisations).toBeDefined();
        expect(response.body.magicItemCategories).toBeDefined();
        expect(response.body.magicItems).toBeDefined();
        expect(response.body.magicStandards).toBeDefined();
        expect(response.body.equipments).toBeDefined();
        expect(response.body.specialRules).toBeDefined();
    });

    xit(":id: Try to retrieve not existing army's data", async () => {
        const response = await request(app.getHttpServer())
            .get(`/armies/${FAKE_ID}`);

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    xit(":id: Use invalid id type - then should return Bad Request (400)", async () => {
        const response = await request(app.getHttpServer())
            .get(`/armies/${INVALID_ID}`);

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });
});
