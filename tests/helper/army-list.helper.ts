import { ArmyListUnitCredentialsDTO } from "../../src/army-list/army-list-unit/army-list-unit-credentials.dto";
import { ArmyListUnitDTO } from "../../src/army-list/army-list-unit/army-list-unit.dto";
import { List } from "../fixtures/army-list/armies-lists";
import { ArmyListDTO } from "../../src/army-list/army-list.dto";

class ArmyListHelper {
    function

    public static compareUnitWithCredentials(lhs: ArmyListUnitCredentialsDTO, rhs: ArmyListUnitDTO) {
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

    public static compareLists(lhs: List, rhs: ArmyListDTO) {
        expect(lhs.name).toEqual(rhs.name);
        expect(lhs.armyId).toEqual(rhs.armyId);
        expect(lhs.valuePoints).toEqual(rhs.valuePoints);
        expect(lhs.isShared).toEqual(rhs.isShared);
        expect(lhs.isFavorite).toEqual(rhs.isFavorite);
        expect(lhs.units.length).toEqual(rhs.units.length);
        for (let i = 0; i < lhs.units.length && i < rhs.units.length; i++) {
            this.compareUnitWithCredentials(lhs.units[i], rhs.units[i]);
        }
    }
}

export default ArmyListHelper;
