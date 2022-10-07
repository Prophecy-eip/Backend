import { Army } from "./army.entity";
import { UnitDTO } from "./unit/unit.dto";
import { UnitCategory } from "./unit/unit-category/unit-category.entity";
import { Rule } from "./rule/rule.entity";
import { Unit } from "./unit/unit.entity";

export class ArmyDTO {
    constructor(army: Army, unitCategories: UnitCategory[], units: UnitDTO[], rules: Rule[]) {
        this.id = army.id;
        this.name = army.name;
        this.unitCategories = unitCategories;
        this.rules = rules;
        this.units = units;
    }

    id: string;
    name: string;
    unitCategories: UnitCategory[]
    units: UnitDTO [];
    rules: Rule[]
}