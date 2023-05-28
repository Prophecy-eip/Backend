import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, HttpCode, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { ArmyListUnitCredentialsDTO } from "../../../src/army-list/army-list-unit/army-list-unit-credentials.dto";
import { TestsHelper } from "../../tests.helper";

jest.setTimeout(15000);

let app: INestApplication;
let token: string;
let token1: string;

const ATTACKING_REGIMENT: ArmyListUnitCredentialsDTO = {
    unitId: 1153,
    quantity: 10,
    formation: "5x2",
    troopIds: [1910],
    magicItems: [],
    magicStandards: [],
    options: [],
    specialRuleTroops: [],
    equipmentTroops: []
}

const DEFENDING_REGIMENT: ArmyListUnitCredentialsDTO = {
    unitId: 2455,
    quantity: 5,
    formation: "5x1",
    troopIds: [3641],
    magicItems: [],
    magicStandards: [],
    options: [],
    specialRuleTroops: [],
    equipmentTroops: []
}

const REQUEST = {
    attackingPosition: "front",
    attackingRegiment: ATTACKING_REGIMENT,
    defendingRegiment: DEFENDING_REGIMENT
}

const REQUEST_UNIT_PROPHECY_ROUTE: string = "/prophecies/units/request-prophecy";
const UNIT_PROPHECY_LOOKUP_ROUTE: string = "/prophecies/units/lookup";
const UNIT_PROPHECY_DELETE_ROUTE: string = "/prophecies/units/delete";

describe("Prophecies route", () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
        token = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), TestsHelper.USERNAME, TestsHelper.EMAIL,
            TestsHelper.PASSWORD);
        token1 = await TestsHelper.createAccountAndGetToken(app.getHttpServer(), TestsHelper.USERNAME1, TestsHelper.EMAIL1,
            TestsHelper.PASSWORD);

    });

    afterAll(async () => {
        await TestsHelper.deleteAccount(app.getHttpServer(), token);
        await TestsHelper.deleteAccount(app.getHttpServer(), token1);
    })

    /**
     * UNITS REQUEST PROPHECY
     */

    xit("units/request-prophecy: create basic prophecy - then should return 201 (Created)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(REQUEST);

        expect(res1.status).toEqual(HttpStatus.CREATED);
        expect(res1.body.attackingRegiment).toBeDefined();
        expect(res1.body.defendingRegiment).toBeDefined();
        expect(res1.body.bestCase).toBeDefined();
        expect(res1.body.meanCase).toBeDefined();
        expect(res1.body.worstCase).toBeDefined();
        expect(res1.body.attackingPosition).toBeDefined();
    });

    xit("units/request-prophecy: create prophecy with invalid token - then should return 401 (Unauthorized)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer abcd`).send(REQUEST);

        expect(res1.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    xit("units/request-prophecy: create prophecy with invalid unit id - then should return 404 (Not found)", async () => {
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
            defendingRegiment: DEFENDING_REGIMENT
        }

        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.NOT_FOUND);
    });

    xit("units/request-prophecy: create prophecy without attacking regiment - then should return 400 (Bad request)", async () => {
        const req = {
            defendingRegiment: DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    xit("units/request-prophecy: create prophecy with null attacking regiment - then should return 400 (Bad request)", async () => {
        const req = {
            attackingRegiment: null,
            defendingRegiment: DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    xit("units/request-prophecy: create prophecy without defending regiment - then should return 400 (Bad request)", async () => {
        const req = {
            attackingRegiment: ATTACKING_REGIMENT,
        };

        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    xit("units/request-prophecy: create prophecy with back attacking position - then should return 201 (Created)", async () => {
        const req = {
            attackingPosition: "back",
            attackingRegiment: ATTACKING_REGIMENT,
            defendingRegiment: DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.CREATED);
    });

    xit("units/request-prophecy: create prophecy with flank attacking position - then should return 201 (Created)", async () => {
        const req = {
            attackingPosition: "flank",
            attackingRegiment: ATTACKING_REGIMENT,
            defendingRegiment: DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.CREATED);
    });

    xit("units/request-prophecy: create prophecy without attacking position - then should return 400 (Bad Request)", async () => {
        const req = {
            attackingRegiment: ATTACKING_REGIMENT,
            defendingRegiment: DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    xit("units/request-prophecy: create prophecy with empty attacking position - then should return 400 (Bad Request)", async () => {
        const req = {
            attackingPosition: "",
            attackingRegiment: ATTACKING_REGIMENT,
            defendingRegiment: DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    xit("units/request-prophecy: create prophecy with invalid attacking position - then should return 400 (Bad Request)", async () => {
        const req = {
            attackingPosition: "abcd",
            attackingRegiment: ATTACKING_REGIMENT,
            defendingRegiment: DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    xit("units/request-prophecy: create prophecy with null defending regiment - then should return 400 (Bad request)", async () => {
        const req = {
            attackingRegiment: ATTACKING_REGIMENT,
            defendingRegiment: null
        };

        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    xit("units/request-prophecy: create prophecy without troop - then should return 400 (Bad request)", async () => {
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
            defendingRegiment: DEFENDING_REGIMENT
        };
        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    xit("units/request-prophecy: create prophecy with too many troops - then should return 400 (Bad request)", async () => {
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
            defendingRegiment: DEFENDING_REGIMENT
        };
        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * UNITS LOOKUP
     */

    xit("units/lookup: basic lookup - then should return 200 (Ok)", async () => {
        const res = await request(app.getHttpServer())
            .get(UNIT_PROPHECY_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);
        for (const prophecy of res.body) {
            expect(prophecy.attackingRegiment).toBeDefined();
            expect(prophecy.defendingRegiment).toBeDefined();
            expect(prophecy.bestCase).toBeDefined();
            expect(prophecy.meanCase).toBeDefined();
            expect(prophecy.worstCase).toBeDefined();
            expect(prophecy.id).toBeDefined();
        }
    });

    xit("units/lookup: lookup with invalid token - then should return 401 (Unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .get(UNIT_PROPHECY_LOOKUP_ROUTE)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    /**
     * UNITS DELETE
     */

    xit("units/delete: basic delete - then should return 200 (Ok)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(REQUEST);

        const propheciesRes = await request(app.getHttpServer())
            .get(UNIT_PROPHECY_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = propheciesRes.body[0].id;

        const res = await request(app.getHttpServer())
            .delete(`${UNIT_PROPHECY_DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);
        const propheciesRes2 = await request(app.getHttpServer())
            .get(UNIT_PROPHECY_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        expect(propheciesRes2.body.find(prophecy => prophecy.id === id)).toEqual(undefined);
    });

    xit("units/delete: delete with invalid token - then should return 401 (Unauthorized)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(REQUEST);

        const propheciesRes = await request(app.getHttpServer())
            .get(UNIT_PROPHECY_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = propheciesRes.body[0].id;

        const res = await request(app.getHttpServer())
            .delete(`${UNIT_PROPHECY_DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    xit("units/delete: delete not owned prophecy - then should return 403 (Forbidden)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(REQUEST_UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(REQUEST);

        const propheciesRes = await request(app.getHttpServer())
            .get(UNIT_PROPHECY_LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = propheciesRes.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${UNIT_PROPHECY_DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`);

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });

    xit("units/delete: delete without id - then should return 404 (Not found)", async () => {
        const res = await request(app.getHttpServer())
            .delete(`${UNIT_PROPHECY_DELETE_ROUTE}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    xit("units/delete: delete un-existing prophecy - then should return 404 (Not found)", async () => {
        const id: string = "abcd";
        const res = await request(app.getHttpServer())
            .delete(`${UNIT_PROPHECY_DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });
});
