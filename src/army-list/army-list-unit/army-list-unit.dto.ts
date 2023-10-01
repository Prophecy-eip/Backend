import { ArmyListUnit } from "./army-list-unit.entity";
import { ArmyListUnitMagicItemDTO } from "./magic-item/army-list-unit-magic-item.dto";
import { ArmyListUnitMagicStandardDTO } from "./magic-standard/army-list-unit-magic-standard.dto";
import { ArmyListUnitOptionDTO } from "./option/army-list-unit-option.dto";
import { Troop } from "@army/unit/troop/troop.entity";
import { ArmyListUnitTroopSpecialRuleDTO } from "./troop/special-rule/army-list-unit-troop-special-rule.dto";
import { ArmyListUnitTroopEquipmentDTO } from "./troop/equipment/army-list-unit-troop-equipment.dto";
import { ArmyListUnitMagicItem } from "@army-list/army-list-unit/magic-item/army-list-unit-magic-item.entity";
import {
    ArmyListUnitMagicStandard
} from "@army-list/army-list-unit/magic-standard/army-list-unit-magic-standard.entity";
import { ArmyListUnitOption } from "@army-list/army-list-unit/option/army-list-unit-option.entity";
import {
    ArmyListUnitTroopSpecialRule
} from "@army-list/army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.entity";
import {
    ArmyListUnitTroopEquipment
} from "@army-list/army-list-unit/troop/equipment/army-list-unit-troop-equipment.entity";

export class ArmyListUnitDTO {
    constructor(armyListUnit: ArmyListUnit) {
        this.unitId = armyListUnit.unit.id;
        this.quantity = armyListUnit.quantity;
        this.formation = armyListUnit.formation;
        this.troops = armyListUnit.troops;
        this.magicItems = armyListUnit.magicItems.map((i: ArmyListUnitMagicItem): ArmyListUnitMagicItemDTO =>
            ArmyListUnitMagicItemDTO.fromArmyListUnitMagicItem(i));
        this.magicStandards = armyListUnit.magicStandards.map((s: ArmyListUnitMagicStandard): ArmyListUnitMagicStandardDTO =>
            ArmyListUnitMagicStandardDTO.fromArmyListUnitMagicStandard(s));
        this.options = armyListUnit.options.map((o: ArmyListUnitOption): ArmyListUnitOptionDTO =>
            ArmyListUnitOptionDTO.fromArmyListUnitOption(o));
        this.specialRuleTroops = armyListUnit.specialRuleTroops.map((r: ArmyListUnitTroopSpecialRule): ArmyListUnitTroopSpecialRuleDTO =>
            ArmyListUnitTroopSpecialRuleDTO.fromArmyListUnitTroopSpecialRule(r));
        this.equipmentTroops = armyListUnit.equipmentTroops.map((e: ArmyListUnitTroopEquipment): ArmyListUnitTroopEquipmentDTO =>
            ArmyListUnitTroopEquipmentDTO.fromArmyListUnitTroopEquipment(e));
    }

    public unitId: number;
    public quantity: number;
    public formation: string;
    public troops: Troop[] = [];
    public magicItems: ArmyListUnitMagicItemDTO[] = [];
    public magicStandards: ArmyListUnitMagicStandardDTO[] = [];
    public options: ArmyListUnitOptionDTO[] = [];
    public specialRuleTroops: ArmyListUnitTroopSpecialRuleDTO[] = [];
    public equipmentTroops: ArmyListUnitTroopEquipmentDTO[] = [];
}
