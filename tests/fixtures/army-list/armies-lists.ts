import { ArmyListUnitCredentialsDTO } from "../../../src/army-list/army-list-unit/army-list-unit-credentials.dto";

export class List {
    constructor(name: string, armyId: number, valuePoints: number, units: ArmyListUnitCredentialsDTO[], isShared: boolean,
        isFavorite: boolean) {
        this.name = name;
        this.armyId = armyId;
        this.valuePoints = valuePoints;
        this.units = units;
        this.isShared = isShared;
        this.isFavorite = isFavorite;
    }

    name: string;
    armyId: number;
    valuePoints: number;
    units: ArmyListUnitCredentialsDTO[];
    isShared: boolean;
    isFavorite: boolean;
}

export const UNITS1: ArmyListUnitCredentialsDTO[] = [
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

export const UNITS2: ArmyListUnitCredentialsDTO[] = [
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

export const ARMY1: List = {
    name: "list 1",
    armyId: 2,
    valuePoints: 500,
    units: UNITS1,
    isShared: false,
    isFavorite: true,
}

export const ARMY2: List = {
    name: "list 2",
    armyId: 21,
    valuePoints: 300,
    units: [],
    isShared: true,
    isFavorite: false,
}
