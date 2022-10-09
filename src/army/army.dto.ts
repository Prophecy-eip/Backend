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

export class ArmyDTO {
    constructor(army: Army) {
        this.id = army.id;
        this.name = army.name;
        this.unitCategories = army.unitCategories;
        this.rules = army.rules;
        for (let i = 0; i < army.units.length; i++)
            this.units.push(new UnitDTO(army.units[i]));
        this.upgradeCategories = army.upgradeCategories;
        for (let i = 0; i < army.upgrades.length; i++)
            this.upgrades .push(new UpgradeDTO(army.upgrades[i]));
        this.specialItemCategories = army.specialItemCategories;
        this.specialItems = army.specialItems;
    }

    id: string;
    name: string;
    unitCategories: UnitCategory[] = [];
    units: UnitDTO [] = [];
    rules: Rule[] = [];
    upgradeCategories: UpgradeCategory[] = [];
    upgrades: UpgradeDTO[] = [];
    specialItemCategories: SpecialItemCategory[] = [];
    specialItems: SpecialItem[] = [];
    options: Option[] = []
}