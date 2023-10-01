import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import { TestsHelper } from "../../../tests.helper";
import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { ArmyListUnitCredentialsDTO } from "../../../../src/army-list/army-list-unit/army-list-unit-credentials.dto";
import { PROPHEC_UNIT_ATTACKING_REGIMENT, PROPHECY_UNIT_DEFENDING_REGIMENT, PROPHECY_UNIT_REQUEST } from "../../../fixtures/prophecy/prophecy";

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

let app: INestApplication;
let token: string;
let token1: string;

describe("prophecies/units/create", () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
        token = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), USERNAME, EMAIL,
            PASSWORD);
        token1 = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), USERNAME1, EMAIL1,
            PASSWORD);

    });

    afterAll(async () => {
        await TestsHelper.deleteAccount(app.getHttpServer(), token);
        await TestsHelper.deleteAccount(app.getHttpServer(), token1);
    });

    it("basic prophecy - then should return 201 (Created)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(PROPHECY_UNIT_REQUEST);

        expect(res1.status).toEqual(HttpStatus.CREATED);
        expect(res1.body.attackingRegiment).toBeDefined();
        expect(res1.body.defendingRegiment).toBeDefined();
        expect(res1.body.bestCase).toBeDefined();
        expect(res1.body.meanCase).toBeDefined();
        expect(res1.body.worstCase).toBeDefined();
        expect(res1.body.attackingPosition).toBeDefined();
    });

    it("invalid token - then should return 401 (Unauthorized)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer abcd`).send(PROPHECY_UNIT_REQUEST);

        expect(res1.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("invalid unit id - then should return 404 (Not found)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 123456,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }
        const req = {
            attackingPosition: "front",
            attackingRegiment: unit,
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT
        }

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("no attacking regiment - then should return 400 (Bad request)", async () => {
        const req = {
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null attacking regiment - then should return 400 (Bad request)", async () => {
        const req = {
            attackingRegiment: null,
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("no defending regiment - then should return 400 (Bad request)", async () => {
        const req = {
            attackingRegiment: PROPHEC_UNIT_ATTACKING_REGIMENT,
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("back attacking position - then should return 201 (Created)", async () => {
        const req = {
            attackingPosition: "back",
            attackingRegiment: PROPHEC_UNIT_ATTACKING_REGIMENT,
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.CREATED);
    });

    it("flank attacking position - then should return 201 (Created)", async () => {
        const req = {
            attackingPosition: "flank",
            attackingRegiment: PROPHEC_UNIT_ATTACKING_REGIMENT,
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.CREATED);
    });

    it("no attacking position - then should return 400 (Bad Request)", async () => {
        const req = {
            attackingRegiment: PROPHEC_UNIT_ATTACKING_REGIMENT,
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("empty attacking position - then should return 400 (Bad Request)", async () => {
        const req = {
            attackingPosition: "",
            attackingRegiment: PROPHEC_UNIT_ATTACKING_REGIMENT,
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("invalid attacking position - then should return 400 (Bad Request)", async () => {
        const req = {
            attackingPosition: "abcd",
            attackingRegiment: PROPHEC_UNIT_ATTACKING_REGIMENT,
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null defending regiment - then should return 400 (Bad request)", async () => {
        const req = {
            attackingRegiment: PROPHEC_UNIT_ATTACKING_REGIMENT,
            defendingRegiment: null
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("no troop - then should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        };
        const req = {
            attackingRegiment: unit,
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT
        };
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("too many troops - then should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910, 1112],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }
        const req = {
            attackingRegiment: unit,
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT
        };
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });
});
