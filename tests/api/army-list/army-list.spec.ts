import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';

const USERNAME = "username";
const PASSWORD = "password";
const LIST_NAME: string = "my list"
const ARMY_ID: string = "3557-241b-5999-a3b1"
const COST: string = "50 pts"
const UNIT_ID: string = "46e2-fcb1-5337-a50e"
const OPTIONS_ID: string[] = ["0a9c-5e46-6e74-afae"]
const UPGRADES_ID: string[] = ["8534-d1f1-73a1-48e9"]
const NUMBER: number = 3;
const FORMATION = "3x1";
const IS_SHARED: boolean = false;

const ARMIES_LIST_ROUTE: string = "/armies-lists";
const CREATE_ROUTE: string = ARMIES_LIST_ROUTE + "/create";

let app: INestApplication;
let token: string;

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
        token = await getToken(USERNAME, PASSWORD)
    });

    async function getToken(id: string, password: string): Promise<string> {
        const r1 = await request(app.getHttpServer())
            .post("/account/sign-up")
            .send({
                      username: id,
                      password: password
        });

        const r2 = await request(app.getHttpServer())
            .post("/account/sign-in")
            .send({
                      username: id,
                      password: password
        });
        return r2.body.access_token;
    }

    it("create: create basic list - then should return 201 (created)", async () => {
        const units: Unit[] = [ {
            unitId: UNIT_ID,
            upgrades: [],
            options: [],
            formation: FORMATION,
            number: NUMBER
        }];
        const list: List = new List(LIST_NAME, ARMY_ID, COST, units, UPGRADES_ID, []);
        const response1 = await request(app.getHttpServer())
            .put(CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);
    });

    it("create: create list with invalid armyId - then should return 404 (not found)", async () => {
        const units: Unit[] = [ {
            unitId: UNIT_ID,
            upgrades: [],
            options: [],
            formation: FORMATION,
            number: NUMBER
        }];
        const list: List = new List(LIST_NAME, "abcd", COST, units, UPGRADES_ID, []);
        const response1 = await request(app.getHttpServer())
            .put(CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);
    });
});
