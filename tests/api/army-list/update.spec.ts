import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { TestsHelper } from "../../tests.helper";
import * as request from "supertest";
import { ARMY1, ARMY2, List } from "../../fixtures/army-list/armies-lists";
import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import ArmyListHelper from "../../helper/army-list.helper";
import { ArmyListParameterDTO } from "../../../src/army-list/army-list.dto";

jest.setTimeout(70000);

const USERNAME = faker.internet.userName();
const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USERNAME1 = faker.internet.userName();
const EMAIL1 = faker.internet.email();
const PASSWORD1 = faker.internet.password();

let app: INestApplication;
let token: string;
let token1: string;
let user1ListId: string;
let user2ListId: string;

describe("armies-lists/update", () => {
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

        user1ListId = await request(app.getHttpServer())
            .post(`${TestsHelper.ARMIES_LISTS_ROUTE}`)
            .set("Authorization", `Bearer ${token}`).send(ARMY1).then(res => res.body.id);

        user2ListId = await request(app.getHttpServer())
            .post(`${TestsHelper.ARMIES_LISTS_ROUTE}`)
            .set("Authorization", `Bearer ${token1}`).send(ARMY2).then(res => res.body.id);
    });

    afterAll(async () => {
        await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`);
        await request(app.getHttpServer())
            .delete(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user2ListId}`)
            .set("Authorization", `Bearer ${token1}`);
        await TestsHelper.deleteAccount(app.getHttpServer(), token, PASSWORD);
        await TestsHelper.deleteAccount(app.getHttpServer(), token1, PASSWORD);
    });

    it("basic - should return 200 (ok) and values should have changed", async () => {
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.OK);

        const listRes = await request(app.getHttpServer())
            .get(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`)
        ArmyListHelper.compareLists(ARMY2, listRes.body);
    });

    it("use invalid armyId - should return 404 (not found)", async () => {
        const id: string = "abcd";
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("try update not owned list - should return 403 (forbidden)", async () => {
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token1}`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("use invalid token - should return 401 (unauthorized)", async () => {
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer abcd`)
            .send(ARMY2);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    // DTO
    it("all properties null - should return 400 (Bad Request)", async() => {
        const dto = {
            name: null,
            armyId: null,
            valuePoints: null,
            units: null,
            isShared: null,
            isFavorite: null
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("all properties undefined - should return 400 (Bad Request)", async() => {
        const dto: ArmyListParameterDTO = {
            name: undefined,
            armyId: undefined,
            valuePoints: undefined,
            units: undefined,
            isShared: undefined,
            isFavorite: undefined
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null army list - should return 400 (Bad Request)", async() => {
        const dto = null;
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined army list - should return 400 (Bad Request)", async() => {
        const dto = undefined;
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined name - should return 400 (Bad Request)", async() => {
        const dto = {
            name: undefined,
            armyId: 1,
            valuePoints: 1,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null name - should return 400 (Bad Request)", async() => {
        const dto = {
            name: null,
            armyId: 1,
            valuePoints: 1,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined armyId - should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: undefined,
            valuePoints: 1,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null armyId - should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: null,
            valuePoints: 1,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined valuePoints - return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: undefined,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null valuePoints - should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: null,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("<1 valuePoints - should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 0,
            units: [],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("undefined units - should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: undefined,
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("null units - should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: null,
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("null unit id - should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: [null],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("undefined unit id - should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: [undefined],
            isShared: true,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("undefined isShared - should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: [],
            isShared: undefined,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("null isShared - should return return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: [],
            isShared: null,
            isFavorite: true
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("undefined isFavorite - should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: [],
            isShared: true,
            isFavorite: undefined
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    it("null isFavorite - should return 400 (Bad Request)", async() => {
        const dto = {
            name: "name",
            armyId: 1,
            valuePoints: 1,
            units: [],
            isShared: true,
            isFavorite: null
        };
        const res = await request(app.getHttpServer())
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(dto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    });

    /**
     * UNITS
     */

    it("units: valid properties - should return 200 (OK)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("units: all null properties - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: all undefined properties - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null unitId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined unitId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null quantity - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined quantity - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: <1 quantity - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null formation - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined formation - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: formation is empty string - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null troopIds - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined troopIds - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null troop id - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined troop id - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null magicItems - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined magicItems - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined magic item object - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null magic item object - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null magicStandards - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined magicStandards - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined magic standard object - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null magic standard object - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null options - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined options - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null option object - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined option object - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null specialRuleTroops - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined specialRuleTroops - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null rule object - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined rule object - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null equipmentTroops - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined equipmentTroops - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null equipment object - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined equipment object - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });


    it("units::magicItems: valid properties - should return 200 (OK)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("units::magicItems: null unitOptionId & equipmentId - should return 200 (OK)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("units::magicItems: undefined unitOptionId & equipmentId - should return 200 (OK)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("units::magicItems: all null properties - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: all undefined properties - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: null unitId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: undefined unitId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: undefined magicItemId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: null magicItemId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: null quantity - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: undefined quantity - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: <1 quantity - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: null valuePoints - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: undefined valuePoints - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicItems: <1 valuePoints - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * UNITS::MAGIC_STANDARDS
     */
    it("units::magicStandards: valid properties - should return 200 (OK)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("units::magicStandards: all null properties - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: all undefined properties - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: undefined magicStandardId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: null magicStandardId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: null unitOptionId - should return 200 (OK)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("units::magicStandards: undefined unitOptionId - should return 200 (OK)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("units::magicStandards: null quantity - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: undefined quantity - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: <1 quantity - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: null valuePoints - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: undefined valuePoints - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::magicStandards: <1 valuePoints - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * UNIT::OPTIONS
     */
    it("units::options: valid properties - should return 200 (OK)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("units::options: all null properties - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: all undefined properties - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: null unitId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: undefined unitId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: undefined optionId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: null optionId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: null quantity - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: undefined quantity - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: <1 quantity - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: undefined valuePoints - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: null valuePoints - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::options: <1 valuePoints - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * UNITS::SPECIAL_RULE
     */

    it("units::specialRule: valid properties - should return 200 (OK)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("units::specialRule: all null properties - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::specialRule: all undefined properties - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::specialRule: undefined troopId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::specialRule: null troopId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::specialRule: null ruleId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::specialRule: undefined ruleId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    /**
     * UNIT::EQUIPMENT_TROOPS
     */
    it("units::equipmentTroops: valid properties - should return 200 (OK)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.OK);
    });

    it("units::equipmentTroops: all null properties - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::equipmentTroops: all undefined properties - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::equipmentTroops: undefined troopId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::equipmentTroops: null troopId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::equipmentTroops: null equipmentId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units::equipmentTroops: undefined equipmentId - should return 400 (Bad Request)", async() => {
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
            .put(`${TestsHelper.ARMIES_LISTS_ROUTE}/${user1ListId}`)
            .set("Authorization", `Bearer ${token}`).send(list);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
});
