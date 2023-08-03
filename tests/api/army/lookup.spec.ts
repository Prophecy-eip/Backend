import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import * as request from "supertest";
import { TestsHelper } from "../../tests.helper";
import { HttpStatus, INestApplication } from "@nestjs/common";

let app: INestApplication;

describe("Armies Routes", () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it("lookup: Retrieve army credentials", async () => {
        const response = await request(app.getHttpServer())
            .get(TestsHelper.ARMIES_ROUTE);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.length).toBeGreaterThan(0);
        response.body.map(a => {
            expect(a.id).toBeDefined();
            expect(a.name).toBeDefined();
        })
    });
});
