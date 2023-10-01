import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { TestsHelper } from "../../tests.helper";
import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { ARMY1, ARMY2, List } from "../../fixtures/army-list/armies-lists";
import { ArmyListParameterDTO } from "../../../src/army-list/army-list.dto";

jest.setTimeout(25000)

const LIST_NAME: string = "my list";

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

let app: INestApplication;
let token: string;
let token1: string;

describe("armies-lists/create", () => {
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
        const res = await  request(app.getHttpServer())
            .get(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`);

        for (const a of res.body) {
            await request(app.getHttpServer())
                .delete(`${TestsHelper.ARMIES_LISTS_ROUTE}/${a.id}`)
                .set("Authorization", `Bearer ${token}`);
        }
        await TestsHelper.deleteAccount(app.getHttpServer(), token);
        await TestsHelper.deleteAccount(app.getHttpServer(), token1);
    });

    it("basic lists - then should return 201 (created)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(ARMY1);

        expect(res1.status).toEqual(HttpStatus.CREATED);
        expect(res1.body.id).toBeDefined();
    });

    it("empty units - then should return 201 (created)", async () => {
        const list: List = new List("name", ARMY1.armyId, 500, [], false, false);
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res1.status).toEqual(HttpStatus.CREATED);
        expect(res1.body.id).toBeDefined();
    });

    it("create list with invalid armyId - then should return 404 (not found)", async () => {
        const list: List = new List(LIST_NAME, 123456, 123, [], false, false);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("create list with invalid token - then should return 401 (unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer abcd`).send(ARMY1);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    // DTO
    it("all properties null - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: null,
            armyId: null,
            valuePoints: null,
            units: null,
            isShared: null,
            isFavorite: null
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("all properties undefined - then should return 400 (Bad Request)", async() => {
        const dto: ArmyListParameterDTO = {
            name: undefined,
            armyId: undefined,
            valuePoints: undefined,
            units: undefined,
            isShared: undefined,
            isFavorite: undefined
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null army list - then should return 400 (Bad Request)", async() => {
        const dto = null;
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined army list - then should return 400 (Bad Request)", async() => {
        const dto = undefined;
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined name - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: undefined,
            armyId: 1,
            valuePoints: 1,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null name - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: null,
            armyId: 1,
            valuePoints: 1,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined armyId - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: undefined,
            valuePoints: 1,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null armyId - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: null,
            valuePoints: 1,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined valuePoints - then return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: undefined,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null valuePoints - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: null,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("<1 valuePoints - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 0,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("undefined units - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: undefined,
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("null units - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: null,
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("null unit id - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: [null],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("undefined unit id - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: [undefined],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("undefined isShared - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: [],
            isShared: undefined,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("null isShared - then should return return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: [],
            isShared: null,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("undefined isFavorite - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: [],
            isShared: true,
            isFavorite: undefined
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("null isFavorite - then should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: [],
            isShared: true,
            isFavorite: null
        };
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    /**
     * UNITS
     */

    it("units: valid properties - then should return 201 (Created)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("units: all null properties - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: null,
            quantity: null,
            formation: null,
            troopIds: null,
            magicItems: null,
            magicStandards: null,
            options: null,
            specialRuleTroops: null,
            equipmentTroops: null
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: all undefined properties - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: undefined,
            quantity: undefined,
            formation: undefined,
            troopIds: undefined,
            magicItems: undefined,
            magicStandards: undefined,
            options: undefined,
            specialRuleTroops: undefined,
            equipmentTroops: undefined
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null unitId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: null,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined unitId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: undefined,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null quantity - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: null,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined quantity - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: undefined,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: <1 quantity - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 0,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null formation - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: null,
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined formation - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: undefined,
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: formation is empty string - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null troopIds - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: null,
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined troopIds - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: undefined,
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null troop id - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [null],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined troop id - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [undefined],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null magicItems - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: null,
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined magicItems - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: undefined,
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined magic item object - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [undefined],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null magic item object - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [null],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null magicStandards - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: null,
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined magicStandards - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: undefined,
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined magic standard object - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [undefined],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null magic standard object - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [null],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null options - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: null,
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined options - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: undefined,
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null option object - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [null],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined option object - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [undefined],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null specialRuleTroops - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: null,
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined specialRuleTroops - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: undefined,
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null rule object - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [null],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined rule object - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [undefined],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null equipmentTroops - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: null
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined equipmentTroops - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: undefined
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null equipment object - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: [null]
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined equipment object - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: [undefined]
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });


    it("units::magicItems: valid properties - then should return 201 (Created)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: 396,
                magicItemId: 1,
                unitOptionId: 1,
                equipmentId: 1,
                quantity: 1,
                valuePoints: 1
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("units::magicItems: null unitOptionId & equipmentId - then should return 201 (Created)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: 396,
                magicItemId: 80,
                unitOptionId: null,
                equipmentId: null,
                quantity: 1,
                valuePoints: 1
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("units::magicItems: undefined unitOptionId & equipmentId - then should return 201 (Created)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: 396,
                magicItemId: 80,
                unitOptionId: undefined,
                equipmentId: undefined,
                quantity: 1,
                valuePoints: 1
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("units::magicItems: all null properties - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: null,
                magicItemId: null,
                unitOptionId: null,
                equipmentId: null,
                quantity: null,
                valuePoints: null
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: all undefined properties - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: undefined,
                magicItemId: undefined,
                unitOptionId: undefined,
                equipmentId: undefined,
                quantity: undefined,
                valuePoints: undefined
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: null unitId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: null,
                magicItemId: 1,
                unitOptionId: 1,
                equipmentId: 1,
                quantity: 1,
                valuePoints: 1
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: undefined unitId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: undefined,
                magicItemId: 1,
                unitOptionId: 1,
                equipmentId: 1,
                quantity: 1,
                valuePoints: 1
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: undefined magicItemId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: 1,
                magicItemId: undefined,
                unitOptionId: 1,
                equipmentId: 1,
                quantity: 1,
                valuePoints: 1
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: null magicItemId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: 1,
                magicItemId: null,
                unitOptionId: 1,
                equipmentId: 1,
                quantity: 1,
                valuePoints: 1
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: null quantity - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: 1,
                magicItemId: 1,
                unitOptionId: 1,
                equipmentId: 1,
                quantity: null,
                valuePoints: 1
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: undefined quantity - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: 1,
                magicItemId: 1,
                unitOptionId: 1,
                equipmentId: 1,
                quantity: undefined,
                valuePoints: 1
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: <1 quantity - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: 1,
                magicItemId: 1,
                unitOptionId: 1,
                equipmentId: 1,
                quantity: 0,
                valuePoints: 1
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: null valuePoints - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: 1,
                magicItemId: 1,
                unitOptionId: 1,
                equipmentId: 1,
                quantity: 1,
                valuePoints: null
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: undefined valuePoints - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: 1,
                magicItemId: 1,
                unitOptionId: 1,
                equipmentId: 1,
                quantity: 1,
                valuePoints: undefined
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: <1 valuePoints - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 1,
            quantity: 1,
            formation: "1x1",
            troopIds: [],
            magicItems: [{
                unitId: 1,
                magicItemId: 1,
                unitOptionId: 1,
                equipmentId: 1,
                quantity: 1,
                valuePoints: 0
            }],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * UNITS::MAGIC_STANDARDS
     */
    it("units::magicStandards: valid properties - then should return 201 (Created)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: 11,
                unitOptionId: 2340,
                quantity: 1,
                valuePoints: 50
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("units::magicStandards: all null properties - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: null,
                unitOptionId: null,
                quantity: null,
                valuePoints: null
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: all undefined properties - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: undefined,
                unitOptionId: undefined,
                quantity: undefined,
                valuePoints: undefined
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: undefined magicStandardId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: undefined,
                unitOptionId: 2340,
                quantity: 1,
                valuePoints: 50
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: null magicStandardId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: null,
                unitOptionId: 2340,
                quantity: 1,
                valuePoints: 50
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: null unitOptionId - then should return 201 (Created)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: 11,
                unitOptionId: null,
                quantity: 1,
                valuePoints: 50
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("units::magicStandards: undefined unitOptionId - then should return 201 (Created)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: 11,
                unitOptionId: undefined,
                quantity: 1,
                valuePoints: 50
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("units::magicStandards: null quantity - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: 11,
                unitOptionId: undefined,
                quantity: null,
                valuePoints: 50
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: undefined quantity - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: 11,
                unitOptionId: undefined,
                quantity: undefined,
                valuePoints: 50
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: <1 quantity - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: 11,
                unitOptionId: undefined,
                quantity: 0,
                valuePoints: 50
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: null valuePoints - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: 11,
                unitOptionId: undefined,
                quantity: 1,
                valuePoints: null
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: undefined valuePoints - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: 11,
                unitOptionId: undefined,
                quantity: 1,
                valuePoints: undefined
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: <1 valuePoints - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [{
                magicStandardId: 11,
                unitOptionId: undefined,
                quantity: 1,
                valuePoints: 0
            }],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * UNIT::OPTIONS
     */
    it("units::options: valid properties - then should return 201 (Created)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: 396,
                optionId: 2342,
                quantity: 1,
                valuePoints: 20
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("units::options: all null properties - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: null,
                optionId: null,
                quantity: null,
                valuePoints: null
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: all undefined properties - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: undefined,
                optionId: undefined,
                quantity: undefined,
                valuePoints: undefined
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: null unitId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: null,
                optionId: 2342,
                quantity: 1,
                valuePoints: 20
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: undefined unitId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: undefined,
                optionId: 2342,
                quantity: 1,
                valuePoints: 20
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: undefined optionId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: 396,
                optionId: undefined,
                quantity: 1,
                valuePoints: 20
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: null optionId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: 396,
                optionId: null,
                quantity: 1,
                valuePoints: 20
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: null quantity - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: 396,
                optionId: 2342,
                quantity: null,
                valuePoints: 20
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: undefined quantity - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: 396,
                optionId: 2342,
                quantity: undefined,
                valuePoints: 20
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: <1 quantity - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: 396,
                optionId: 2342,
                quantity: 0,
                valuePoints: 20
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: undefined valuePoints - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: 396,
                optionId: 2342,
                quantity: 1,
                valuePoints: undefined
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: null valuePoints - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: 396,
                optionId: 2342,
                quantity: 1,
                valuePoints: null
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: <1 valuePoints - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [{
                unitId: 396,
                optionId: 2342,
                quantity: 1,
                valuePoints: 0
            }],
            specialRuleTroops: [],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * UNITS::SPECIAL_RULE
     */

    it("units::specialRule: valid properties - then should return 201 (Created)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [{
                troopId: 727,
                ruleId: 5628
            }],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("units::specialRule: all null properties - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [{
                troopId: null,
                ruleId: null
            }],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::specialRule: all undefined properties - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [{
                troopId: undefined,
                ruleId: undefined
            }],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::specialRule: undefined troopId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [{
                troopId: undefined,
                ruleId: 5628
            }],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::specialRule: null troopId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [{
                troopId: null,
                ruleId: 5628
            }],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::specialRule: null ruleId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [{
                troopId: 727,
                ruleId: null
            }],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::specialRule: undefined ruleId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [{
                troopId: 727,
                ruleId: undefined
            }],
            equipmentTroops: []
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * UNIT::EQUIPMENT_TROOPS
     */
    it("units::equipmentTroops: valid properties - then should return 201 (Created)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: [{
                troopId: 727,
                equipmentId: 16
            }]
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("units::equipmentTroops: all null properties - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: [{
                troopId: null,
                equipmentId: null
            }]
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::equipmentTroops: all undefined properties - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: [{
                troopId: undefined,
                equipmentId: undefined
            }]
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::equipmentTroops: undefined troopId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: [{
                troopId: undefined,
                equipmentId: 16
            }]
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::equipmentTroops: null troopId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: [{
                troopId: null,
                equipmentId: 16
            }]
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::equipmentTroops: null equipmentId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: [{
                troopId: 727,
                equipmentId: null
            }]
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::equipmentTroops: undefined equipmentId - then should return 400 (Bad Request)", async() => {
        const list: List = new List("name", ARMY1.armyId, 500, [{
            unitId: 396,
            quantity: 5,
            formation: "3x2",
            troopIds: [],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: [{
                troopId: 727,
                equipmentId: undefined
            }]
        }], true, true);
        const res = await request(app.getHttpServer())
            .post(TestsHelper.ARMIES_LISTS_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
});
