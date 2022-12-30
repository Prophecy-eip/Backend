import { ArmyListUnit } from "./army-list-unit.entity";
import { ArmyListUnitMagicItemDTO } from "./magic-item/army-list-unit-magic-item.dto";
import { ArmyListUnitMagicStandardDTO } from "./magic-standard/army-list-unit-magic-standard.dto";
import { ArmyListUnitOptionDTO } from "./option/army-list-unit-option.dto";
import { Troop } from "../../army/unit/troop/troop.entity";
import { ArmyListUnitTroopSpecialRuleDTO } from "./troop/special-rule/army-list-unit-troop-special-rule.dto";
import { ArmyListUnitTroopEquipmentDTO } from "./troop/equipment/army-list-unit-troop-equipment.dto";

export class ArmyListUnitDTO {
    constructor(unit: ArmyListUnit) {
        this.unitId = unit.unitId;
        this.quantity = unit.quantity;
        this.formation = unit.formation;
        this.troops = unit.troops;
        for (const item of unit.magicItems) {
            this.magicItems.push(new ArmyListUnitMagicItemDTO(item));
        }
        for (const standard of unit.magicStandards) {
            this.magicStandards.push(new ArmyListUnitMagicStandardDTO(standard));
        }
        for (const option of unit.options) {
            this.options.push(new ArmyListUnitOptionDTO(option));
        }
        for (const rule of unit.specialRuleTroops) {
            this.specialRuleTroops.push(new ArmyListUnitTroopSpecialRuleDTO(rule));
        }
        for (const equipment of unit.equipmentTroops) {
            this.equipmentTroops.push(new ArmyListUnitTroopEquipmentDTO(equipment));
        }
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
