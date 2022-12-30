import { ArmyListUnitMagicItemDTO } from "./magic-item/army-list-unit-magic-item.dto";
import { ArmyListUnitMagicStandardDTO } from "./magic-standard/army-list-unit-magic-standard.dto";
import { ArmyListUnitOptionDTO } from "./option/army-list-unit-option.dto";
import { ArmyListUnitTroopSpecialRuleDTO } from "./troop/special-rule/army-list-unit-troop-special-rule.dto";
import { ArmyListUnitTroopEquipmentDTO } from "./troop/equipment/army-list-unit-troop-equipment.dto";

export class ArmyListUnitCredentialsDTO {
    public unitId: number;
    public quantity: number;
    public formation: string;
    public troopIds: number[] = [];
    public magicItems: ArmyListUnitMagicItemDTO[] = [];
    public magicStandards: ArmyListUnitMagicStandardDTO[] = [];
    public options: ArmyListUnitOptionDTO[] = [];
    public specialRuleTroops: ArmyListUnitTroopSpecialRuleDTO[] = [];
    public equipmentTroops: ArmyListUnitTroopEquipmentDTO[] = [];
}
