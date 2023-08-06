import { ArmyListUnitTroopSpecialRule } from "./army-list-unit-troop-special-rule.entity";

export class ArmyListUnitTroopSpecialRuleDTO {
    constructor(rule: ArmyListUnitTroopSpecialRule) {
        this.troopId = rule.troopId;
        this.ruleId = rule.rule.id;
    }
    public troopId: number;
    public ruleId: number;
}
