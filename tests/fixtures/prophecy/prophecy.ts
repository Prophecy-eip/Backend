import { ArmyListUnitCredentialsDTO } from "../../../src/army-list/army-list-unit/army-list-unit-credentials.dto";

export const PROPHEC_UNIT_ATTACKING_REGIMENT: ArmyListUnitCredentialsDTO = {
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

export const PROPHECY_UNIT_DEFENDING_REGIMENT: ArmyListUnitCredentialsDTO = {
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

export const PROPHECY_UNIT_REQUEST = {
    attackingPosition: "front",
    attackingRegiment: PROPHEC_UNIT_ATTACKING_REGIMENT,
    defendingRegiment: PROPHECY_UNIT_DEFENDING_REGIMENT
}
