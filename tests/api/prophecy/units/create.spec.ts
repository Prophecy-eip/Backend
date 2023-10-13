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
        await TestsHelper.deleteAccount(app.getHttpServer(), token, PASSWORD);
        await TestsHelper.deleteAccount(app.getHttpServer(), token1, PASSWORD);
    });

    it("basic prophecy - should return 201 (Created)", async () => {
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

    it("invalid token - should return 401 (Unauthorized)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer abcd`).send(PROPHECY_UNIT_REQUEST);

        expect(res1.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("undefined parameter - should return 400 (Bad request)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(undefined);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null parameter - should return 400 (Bad request)", async () => {
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(null);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("all properties undefined - should return 400 (Bad request)", async () => {
        const req = {
            attackingRegiment: undefined,
            defendingRegiment: undefined,
            attackingPosition: undefined
        };
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("all properties null - should return 400 (Bad request)", async () => {
        const req = {
            attackingRegiment: null,
            defendingRegiment: null,
            attackingPosition: null
        };
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined attacking regiment - should return 400 (Bad request)", async () => {
        const req = {
            attackingRegiment: undefined,
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT,
            attackingPosition: "front"
        };
        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null attacking regiment - should return 400 (Bad request)", async () => {
        const req = {
            attackingRegiment: null,
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT,
            attackingPosition: "front"
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("undefined defending regiment - should return 400 (Bad request)", async () => {
        const req = {
            attackingRegiment: PROPHEC_UNIT_ATTACKING_REGIMENT,
            defendingRegiment: undefined,
            attackingPosition: "front"
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("null defending regiment - should return 400 (Bad request)", async () => {
        const req = {
            attackingRegiment: PROPHEC_UNIT_ATTACKING_REGIMENT,
            defendingRegiment: null,
            attackingPosition: "front"
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("back attacking position - should return 201 (Created)", async () => {
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

    it("flank attacking position - should return 201 (Created)", async () => {
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

    it("no attacking position - should return 400 (Bad Request)", async () => {
        const req = {
            attackingRegiment: PROPHEC_UNIT_ATTACKING_REGIMENT,
            defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT
        };

        const res1 = await request(app.getHttpServer())
            .post(TestsHelper.UNIT_PROPHECY_ROUTE)
            .set("Authorization", `Bearer ${token}`).send(req);

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("empty attacking position - should return 400 (Bad Request)", async () => {
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

    it("invalid attacking position - should return 400 (Bad Request)", async () => {
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

    /**
     * UNITS
     */
    it("units: invalid unit id - should return 404 (Not found)", async () => {
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

    it("units: undefined unit id - should return 400 (Bad Request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: undefined,
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

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null unit id - should return 400 (Bad Request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: null,
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

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null quantity - should return 400 (Bad Request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1,
            quantity: null,
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

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined quantity - should return 400 (Bad Request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1,
            quantity: undefined,
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

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: <1 quantity - should return 400 (Bad Request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1,
            quantity: 0,
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

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: null formation - should return 400 (Bad Request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1,
            quantity: 1,
            formation: null,
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

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined formation - should return 400 (Bad Request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1,
            quantity: 1,
            formation: undefined,
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

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: empty formation - should return 400 (Bad Request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1,
            quantity: 1,
            formation: "",
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

        expect(res1.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("units: undefined troopIds - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: undefined,
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

    it("units: null troopIds - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: null,
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

    it("units: no troop id - should return 400 (Bad request)", async () => {
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

    it("units: too many troops - should return 400 (Bad request)", async () => {
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

    it("units: null troop id - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [null],
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

    it("units: undefined troop id - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [undefined],
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

    it("units: undefined magicItems - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: undefined,
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

    it("units: null magicItems - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: null,
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


    it("units: null magic item object - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [null],
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

    it("units: undefined magic item object - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [undefined],
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

    it("units: undefined magicStandards - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: undefined,
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

    it("units: null magicStandards - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: null,
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

    it("units: null magic standard object - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [null],
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

    it("units: undefined magic standard object - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [undefined],
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

    it("units: undefined options - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: undefined,
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

    it("units: null options - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: null,
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

    it("units: null option object - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: [null],
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

    it("units: undefined option object - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: [undefined],
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

    it("units: undefined specialRuleTroops - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: undefined,
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

    it("units: null specialRuleTroops - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: null,
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

    it("units: null special rule troop object - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [null],
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

    it("units: undefined special rule troop object - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [undefined],
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

    it("units: undefined equipmentTroops - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: undefined
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

    it("units: null equipmentTroops - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: null
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


    it("units: null equipment troop object - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: [null]
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

    it("units: undefined equipment troop object - should return 400 (Bad request)", async () => {
        const unit: ArmyListUnitCredentialsDTO = {
            unitId: 1153,
            quantity: 10,
            formation: "5x2",
            troopIds: [1910],
            magicItems: [],
            magicStandards: [],
            options: [],
            specialRuleTroops: [],
            equipmentTroops: [undefined]
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
