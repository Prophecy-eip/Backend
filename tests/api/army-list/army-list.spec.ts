import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { ArmyListUnitCredentialsDTO } from "../../../src/army-list/army-list-unit/army-list-unit-credentials.dto";
import { ArmyListUnitDTO } from "../../../src/army-list/army-list-unit/army-list-unit.dto";
import { ArmyListDTO } from "../../../src/army-list/army-list.dto";
import exp = require("constants");

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

// class Unit {
//     unitId: string;
//     options: string[];
//     upgrades: string[];
//     number: number;
//     formation: string;
// }

class List {
    constructor(name: string, armyId: number, valuePoints: number, units: ArmyListUnitCredentialsDTO[], isShared: boolean,
        isFavourite: boolean) {
        this.name = name;
        this.armyId = armyId;
        this.valuePoints = valuePoints;
        this.units = units;
        this.isShared = isShared;
        this.isFavourite = isFavourite;
    }

    name: string;
    armyId: number;
    valuePoints: number;
    units: ArmyListUnitCredentialsDTO[];
    isShared: boolean;
    isFavourite: boolean;
}

const UNITS1: ArmyListUnitCredentialsDTO[] = [
    {
        unitId: 396,
        quantity: 5,
        formation: "3x2",
        troopIds: [727],
        magicItems: [{
            unitId: 396,
            magicItemId: 80,
            unitOptionId: null,
            equipmentId: null,
            quantity: 1,
            valuePoints: 40
        }],
        magicStandards: [{
            magicStandardId: 11,
            unitOptionId: 2340,
            quantity: 1,
            valuePoints: 50,
        }],
        options: [{
            unitId: 396,
            optionId: 2342,
            quantity: 1,
            valuePoints: 20
        }],
        specialRuleTroops: [{
            troopId: 727,
            ruleId: 5628
        }],
        equipmentTroops: []
    }, {
        unitId: 392,
        quantity: 6,
        formation: "3x2",
        troopIds: [723],
        magicItems: [],
        magicStandards: [],
        options: [],
        specialRuleTroops: [],
        equipmentTroops: []
    }
];

const UNITS2: ArmyListUnitCredentialsDTO[] = [
    {
        unitId: 687,
        quantity: 15,
        formation: "5x3",
        troopIds: [1270],
        magicItems: [],
        magicStandards: [],
        options: [],
        specialRuleTroops: [],
        equipmentTroops: []
    }
]

const ARMY1: List = {
    name: "list 1",
    armyId: 2,
    valuePoints: 500,
    units: UNITS1,
    isShared: false,
    isFavourite: true,
}

const ARMY2: List = {
    name: "list 2",
    armyId: 21,
    valuePoints: 300,
    units: [],
    isShared: true,
    isFavourite: false,
}

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
        const res = await  request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        for (const a of res.body) {
            await request(app.getHttpServer())
                .delete(`${DELETE_ROUTE}/${a.id}`)
                .set("Authorization", `Bearer ${token}`);
        }
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
        // const units: Unit[] = [ {
        //     unitId: UNIT_ID,
        //     upgrades: [],
        //     options: [],
        //     formation: FORMATION,
        //     number: NUMBER
        // }];
        // const list: List = new List(LIST_NAME, ARMY_ID, COST, units, UPGRADES_ID, [], false);
        // const res = await request(app.getHttpServer())
        //     .post(CREATE_ROUTE)
        //     .set("Authorization", `Bearer ${token}`).send(list);

    }

    function compareUnitWithCredentials(lhs: ArmyListUnitCredentialsDTO, rhs: ArmyListUnitDTO) {
        expect(lhs.unitId).toEqual(rhs.unitId);
        expect(lhs.quantity).toEqual(rhs.quantity);
        expect(lhs.formation).toEqual(rhs.formation);
        expect(lhs.troopIds.length).toEqual(rhs.troops.length);
        for (const id of lhs.troopIds) {
            expect(rhs.troops.find(troop => troop.id === id)).toBeDefined();
        }
        expect(lhs.magicStandards).toEqual(rhs.magicStandards);
        expect(lhs.options).toEqual(rhs.options);
        expect(lhs.specialRuleTroops).toEqual(rhs.specialRuleTroops);
        expect(lhs.equipmentTroops).toEqual(rhs.equipmentTroops);
    }
    function compareLists(lhs: List, rhs: ArmyListDTO) {
        expect(lhs.name).toEqual(rhs.name);
        expect(lhs.armyId).toEqual(rhs.armyId);
        expect(lhs.valuePoints).toEqual(rhs.valuePoints);
        expect(lhs.isShared).toEqual(rhs.isShared);
        expect(lhs.isFavourite).toEqual(rhs.isFavourite);
        expect(lhs.units.length).toEqual(rhs.units.length);
        for (let i = 0; i < lhs.units.length && i < rhs.units.length; i++) {
            compareUnitWithCredentials(lhs.units[i], rhs.units[i]);
        }

    }

    /**
     * CREATE
     */
    it("create: create basic lists - then should return 201 (created)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(ARMY1);

        expect(res1.status).toEqual(HttpStatus.CREATED);

        const a1 = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id1: string = a1.body[0].id;
        const listRes1 = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}/${id1}`)
            .set("Authorization", `Bearer ${token}`);
        compareLists(ARMY1, listRes1.body);

        const res2 = await request(app.getHttpServer())
            .post(CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(ARMY2);

        expect(res2.status).toEqual(HttpStatus.CREATED);

        const a2 = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id2: string = a2.body[1].id;
        const listRes2 = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}/${id2}`)
            .set("Authorization", `Bearer ${token}`);
        compareLists(ARMY2, listRes2.body);
    });

    it("create: create list with invalid armyId - then should return 404 (not found)", async () => {
        const list: List = new List(LIST_NAME, 123456, 123, [], false, false);
        const res = await request(app.getHttpServer())
            .post(CREATE_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("create: create list with invalid token - then should return 401 (unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .post(CREATE_ROUTE)
            .set("Authorization", `Bearer abcd`).send(ARMY1);

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
        expect(res.body).toBeDefined();
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
        expect(res.status).toBeDefined();
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

    it(":id: user does not own a not-shared list - then return 403 (forbidden)", async () => {
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body.find(army => army.isShared === false).id;
        const res = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(":id: user does not own a shared list - then should return 200 (OK)", async () => {
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body.find(army => army.isShared === true).id;
        const res = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`);

        expect(res.status).toEqual(HttpStatus.OK);
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
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toEqual(HttpStatus.OK);

        const res2 = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res2.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("delete: use invalid token - then should return unauthorised (401)", async () => {
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer abcd`);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });


    it("delete: not the owner - then should return forbidden (403)", async () => {
        await createArmyList();
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .delete(`${DELETE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`);

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
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
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .put(`${UPDATE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.OK);

        const listRes = await request(app.getHttpServer())
            .get(`${ARMIES_LIST_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`)
        compareLists(ARMY2, listRes.body);
        // expect(listRes.body.name).toEqual(LIST2.name);
        // expect(listRes.body.cost).toEqual(LIST2.valuePoints);
        // expect(listRes.body.army).toEqual(LIST2.armyId);
        // expect(listRes.body.isShared).toEqual(LIST2.isShared);
    });

    it("update: use invalid armyId - then should return 404 (not found)", async () => {
        // await createArmyList();
        const id: string = "abcd";
        const res = await request(app.getHttpServer())
            .put(`${UPDATE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("update: try update not owned list - then should return 403 (forbidden)", async () => {
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .put(`${UPDATE_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token1}`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("update: use invalid token - then should return 401 (unauthorized)", async () => {
        const a = await request(app.getHttpServer())
            .get(LOOKUP_ROUTE)
            .set("Authorization", `Bearer ${token}`);
        const id: string = a.body[0].id;
        const res = await request(app.getHttpServer())
            .put(`${UPDATE_ROUTE}/${id}`)
            .set("Authorization", `Bearer abcd`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
});
