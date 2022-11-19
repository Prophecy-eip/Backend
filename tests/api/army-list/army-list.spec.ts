import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';

const USERNAME = "username";
const PASSWORD = "password";
const EMAIL = "user@prophecy.com";
const USERNAME1 = "username1";
const EMAIL1 = "user1@prophecy.com";

const LIST_NAME: string = "my list";
const ARMY_ID: string = "3557-241b-5999-a3b1";
const COST: string = "50 pts";
const UNIT_ID: string = "46e2-fcb1-5337-a50e";
const OPTIONS_ID: string[] = ["0a9c-5e46-6e74-afae"];
const UPGRADES_ID: string[] = ["8534-d1f1-73a1-48e9"];
const NUMBER: number = 3;
const FORMATION = "3x1";
const IS_SHARED: boolean = false;

const DELETE_ACCOUNT_ROUTE: string = "/account/settings/delete-account";

const ARMIES_LIST_ROUTE: string = "/armies-lists";
const CREATE_ROUTE: string = "/armies-lists/create";
const LOOKUP_ROUTE: string = "/armies-lists/lookup";
const DELETE_ROUTE: string = ARMIES_LIST_ROUTE + "/delete";
const UPDATE_ROUTE: string = ARMIES_LIST_ROUTE + "/update";

let app: INestApplication;
let token: string;
let token1: string;

class Unit {
    unitId: string;
    options: string[];
    upgrades: string[];
    number: number;
    formation: string;
}

class List {
    constructor(name: string, army: string, cost: string, units: Unit[], upgrades: string[], rules: string[], isShared: boolean) {
        this.name = name;
        this.army = army;
        this.cost = cost;
        this.units = units;
        this.upgrades = upgrades;
        this.rules = rules;
        this.isShared = isShared;
    }

    name: string;
    army: string;
    cost: string;
    units: Unit[];
    upgrades: string[];
    rules: string[];
    isShared: boolean;
}
const UNITS1: Unit[] = [{
    unitId: UNIT_ID,
    upgrades: [],
    options: [],
    formation: FORMATION,
    number: NUMBER
}]
const LIST1: List = new List(LIST_NAME, ARMY_ID, COST, UNITS1, UPGRADES_ID, [], false)

const UNITS2: Unit[] = [{
        unitId: "46e2-fcb1-5337-a50e",
        options: ["0a9c-5e46-6e74-afae"],
        upgrades: ["8534-d1f1-73a1-48e9"],
        number: 3,
        formation: "3x1"
    }, {
        unitId: "c995-c5a3-27fd-4fef",
        options: [],
        upgrades: ["8534-d1f1-73a1-48e9"],
        number: 10,
        formation: "5x2"
}];

const LIST2: List = new List("my list 2", ARMY_ID, "1500", UNITS2, [], [], true);

describe("Armies lists route", () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();

        token = await createAccountAndGetToken(USERNAME, EMAIL, PASSWORD);
        token1 = await createAccountAndGetToken(USERNAME1, EMAIL1, PASSWORD);
    });

    afterAll(async () => {
        // const token: string = await getToken();
        await request(app.getHttpServer())
            .delete(DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);
    });

    async function createAccountAndGetToken(username: string, email: string, password: string): Promise<string> {
        const r1 = await request(app.getHttpServer())
            .post("/account/sign-up")
            .send({
                username: username,
                email: email,
                password: password
        });
        const r2 = await request(app.getHttpServer())
            .post("/account/sign-in")
            .send({
                      username: username,
                      password: password
        });
        return r2.body.access_token;
    }

    async function createArmyList(): Promise<void> {
        const units: Unit[] = [ {
            unitId: UNIT_ID,
            upgrades: [],
            options: [],
            formation: FORMATION,
            number: NUMBER
        }];
        const list: List = new List(LIST_NAME, ARMY_ID, COST, units, UPGRADES_ID, [], false);
        const res = await request(app.getHttpServer())
            .post(CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

    }

    /**
     * CREATE
     */
    it("create: create basic list - then should return 201 (created)", async () => {
        const res = await request(app.getHttpServer())
            .post(CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(LIST1);

        expect(res.status).toEqual(HttpStatus.CREATED);

        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const listRes = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(listRes.body.name).toEqual(LIST1.name);
        expect(listRes.body.cost).toEqual(LIST1.cost);
        expect(listRes.body.army).toEqual(LIST1.army);
        expect(listRes.body.isShared).toEqual(LIST1.isShared);
    });

    it("create: create list with invalid armyId - then should return 404 (not found)", async () => {
        const units: Unit[] = [ {
            unitId: UNIT_ID,
            upgrades: [],
            options: [],
            formation: FORMATION,
            number: NUMBER
        }];
        const list: List = new List(LIST_NAME, "abcd", COST, units, UPGRADES_ID, [], false);
        const res = await request(app.getHttpServer())
            .post(CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("create: create list with invalid token - then should return 401 (unauthorized)", async () => {
        const units: Unit[] = [ {
            unitId: UNIT_ID,
            upgrades: [],
            options: [],
            formation: FORMATION,
            number: NUMBER
        }];
        const list: List = new List(LIST_NAME, ARMY_ID, COST, units, UPGRADES_ID, [], false);
        const res = await request(app.getHttpServer())
            .post(CREATE_ROUTE)
            .set("Authorization", `Bearer abcd`).send(list);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    /**
     * LOOKUP
     */
    it("lookup: basic lookup - then return armies lists credentials", async () => {
        const res = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("lookup: with invalid token - then return 401 (unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    /**
     * :ID
     */
    it(":id: basic get - then return 200 (ok)", async () => {
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it(":id: with invalid token - then return 401 (unauthorized)", async () => {
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}/${id}`)
            .set("Authorization", `Bearer abcd`);
        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(":id: with not owner token - then return 401 (unauthorized)", async () => {
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`);
        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(":id: with invalid id - then return 404 (not found)", async () => {
        const id: string = "abcd";
        const res = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND)
    });


    /**
     * DELETE
     */

    it("delete: basic delete - then should return 200 (ok)", async () => {
        await createArmyList();
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("delete: use invalid token - then should return unauthorised (401)", async () => {
        await createArmyList();
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });


    it("delete: not the owner - then should return unauthorized (401)", async () => {
        await createArmyList();
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("delete: use invalid army list id - then should return not found (404)", async () => {
        await createArmyList();
        const id: string = "abcd";
        const res = await request(app.getHttpServer())
            .delete(`${DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    /**
     * UPDATE
     */

    it("update: basic - then should return 200 (ok) and values should have changed", async () => {
        await createArmyList();
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .put(`${UPDATE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(LIST2);

        expect(res.status).toEqual(HttpStatus.OK);

        const listRes = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`)
        expect(listRes.body.name).toEqual(LIST2.name);
        expect(listRes.body.cost).toEqual(LIST2.cost);
        expect(listRes.body.army).toEqual(LIST2.army);
        expect(listRes.body.isShared).toEqual(LIST2.isShared);
    });

    it("update: use invalid armyId - then should return 404 (not found)", async () => {
        await createArmyList();
        const id: string = "abcd";
        const res = await request(app.getHttpServer())
            .put(`${UPDATE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(LIST2);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("update: use invalid token - then should return 401 (unauthorized)", async () => {
        await createArmyList();
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .put(`${UPDATE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`)
            .send(LIST2);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

});
