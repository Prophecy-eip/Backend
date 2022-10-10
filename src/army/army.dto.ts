import { Army } from "./army.entity";
import { UnitDTO } from "./unit/unit.dto";
import { UnitCategory } from "./unit/unit-category/unit-category.entity";
import { Rule } from "./rule/rule.entity";
import { Unit } from "./unit/unit.entity";
import {UpgradeCategory} from "./upgrade/upgrade-category/upgrade-category.entity";
import {Upgrade} from "./upgrade/upgrade.entity";
import {UnitProfile} from "./unit/unit-profile/unit-profile.entity";
import { Option } from "./option/option.entity";
import {SpecialItemCategory} from "./special-item/special-item-category/special-item-category.entity";
import {SpecialItem} from "./special-item/special-item.entity";
import {UpgradeDTO} from "./upgrade/upgrade.dto";
import {SpecialItemCategoryDTO} from "./special-item/special-item-category/special-item-category.dto";

export class ArmyDTO {
    constructor(army: Army) {
        this.id = army.id;
        this.name = army.name;
        this.unitCategories = army.unitCategories;
        this.rules = army.rules;
        for (const unit of army.units)
            this.units.push(new UnitDTO(unit));
        this.upgradeCategories = army.upgradeCategories;
        for (const upgrade of army.upgrades)
            this.upgrades .push(new UpgradeDTO(upgrade));
        for (const category of army.specialItemCategories)
            this.specialItemCategories.push(new SpecialItemCategoryDTO(category))
        this.specialItems = army.specialItems;
    }

    id: string;
    name: string;
    unitCategories: UnitCategory[] = [];
    units: UnitDTO [] = [];
    rules: Rule[] = [];
    upgradeCategories: UpgradeCategory[] = [];
    upgrades: UpgradeDTO[] = [];
    specialItemCategories: SpecialItemCategoryDTO[] = [];
    specialItems: SpecialItem[] = [];
    options: Option[] = []
}