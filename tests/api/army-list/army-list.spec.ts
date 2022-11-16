import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';

const USERNAME = "username";
const PASSWORD = "password";
const EMAIL = "user@prophecy.com"

const LIST_NAME: string = "my list"
const ARMY_ID: string = "3557-241b-5999-a3b1"
const COST: string = "50 pts"
const UNIT_ID: string = "46e2-fcb1-5337-a50e"
const OPTIONS_ID: string[] = ["0a9c-5e46-6e74-afae"]
const UPGRADES_ID: string[] = ["8534-d1f1-73a1-48e9"]
const NUMBER: number = 3;
const FORMATION = "3x1";
const IS_SHARED: boolean = false;

const DELETE_ACCOUNT_ROUTE: string = "/account/settings/delete-account";

const ARMIES_LIST_ROUTE: string = "/armies-lists";
const CREATE_ROUTE: string = "/armies-lists/create"
const LOOKUP_ROUTE: string = "/armies-lists/lookup"

let app: INestApplication;

class Unit {
    unitId: string;
    options: string[];
    upgrades: string[];
    number: number;
    formation: string;
}

class List {
    constructor(name: string, army: string, cost: string, units: Unit[], upgrades: string[], rules: string[]) {
        this.name = name
        this.army = army
        this.cost = cost
        this.units = units
        this.upgrades = upgrades
        this.rules = rules
    }

    name: string;
    army: string;
    cost: string;
    units: Unit[];
    upgrades: string[];
    rules: string[];
}

describe("Armies lists route", () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
        const r1 = await request(app.getHttpServer())
            .post("/account/sign-up")
            .send({
                username: USERNAME,
                email: EMAIL,
                password: PASSWORD
        });
    });

    afterAll(async () => {
        const token: string = await getToken();
        await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);
    });

    async function getToken(): Promise<string> {

        const r2 = await request(app.getHttpServer())
            .post("/account/sign-in")
            .send({
                      username: USERNAME,
                      password: PASSWORD
        });
        return r2.body.access_token;
    }

    it("create: create basic list - then should return 201 (created)", async () => {
        const token: string = await getToken();
        const units: Unit[] = [ {
            unitId: UNIT_ID,
            upgrades: [],
            options: [],
            formation: FORMATION,
            number: NUMBER
        }];
        console.log(token)
        const list: List = new List(LIST_NAME, ARMY_ID, COST, units, UPGRADES_ID, []);
        const res = await request(app.getHttpServer())
            .post(CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);
        console.log(res.body)
        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("create: create list with invalid armyId - then should return 404 (not found)", async () => {
        const token: string = await getToken();
        const units: Unit[] = [ {
            unitId: UNIT_ID,
            upgrades: [],
            options: [],
            formation: FORMATION,
            number: NUMBER
        }];
        const list: List = new List(LIST_NAME, "abcd", COST, units, UPGRADES_ID, []);
        const res = await request(app.getHttpServer())
            .post(CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("create: create list with invalid token - then should return 401 (unauthorized)", async () => {
        const token: string = await getToken();
        const units: Unit[] = [ {
            unitId: UNIT_ID,
            upgrades: [],
            options: [],
            formation: FORMATION,
            number: NUMBER
        }];
        const list: List = new List(LIST_NAME, ARMY_ID, COST, units, UPGRADES_ID, []);
        const res = await request(app.getHttpServer())
            .post(CREATE_ROUTE)
            .set("Authorization", `Bearer abcd`).send(list);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("lookup: basic lookup - then return armies lists credentials", async () => {
        const token: string = await getToken();
        const res = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("lookup: with invalid token - then return 401 (unauthorized)", async () => {
        const token: string = "token";
        const res = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(":id: basic get - then return 200 (ok)", async () => {
        const token: string = await getToken();
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}.${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it(":id: with invalid token - then return 401 (unauthorized)", async () => {
        const token: string = await getToken();
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}.${id}`)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(":id: with invalid id - then return 404 (not found)", async () => {
        const token: string = await getToken();
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = "abcd";
        const res = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}.${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });
});
