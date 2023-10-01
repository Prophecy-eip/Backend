import { ArmyListUnitTroopSpecialRule } from "./army-list-unit-troop-special-rule.entity";
import { IsDefined, IsNumber } from "class-validator";

export class ArmyListUnitTroopSpecialRuleDTO {
    public static fromArmyListUnitTroopSpecialRule(rule: ArmyListUnitTroopSpecialRule): ArmyListUnitTroopSpecialRuleDTO {
        return {
            troopId: rule.troopId,
            ruleId: rule.rule.id
        };
    }

    @IsDefined()
    @IsNumber()
    public troopId: number;

    @IsDefined()
    @IsNumber()
    public ruleId: number;

}
