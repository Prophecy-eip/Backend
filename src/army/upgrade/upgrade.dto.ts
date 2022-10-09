import { Modifier } from "../modifier/modifier.entity";
import {UnitProfileDTO} from "../unit/unit-profile/unit-profile.dto";
import {Rule} from "../rule/rule.entity";
import {Upgrade} from "./upgrade.entity";

export class UpgradeDTO {
    constructor(upgrade: Upgrade) {
        this.id = upgrade.id;
        this.name = upgrade.name;
        this.isCollective = upgrade.isCollective;
        this.limits = upgrade.limits;
        this.cost = upgrade.cost;
        this.modifiers = upgrade.modifiers;
        for (let i = 0; i < upgrade.profiles.length; i++)
            this.profiles.push(new UnitProfileDTO(upgrade.profiles[i]));
        this.rules = upgrade.rules;
    }

    public id: string;
    public name: string;
    public isCollective: string;
    public limits: string;
    public cost: string;
    public modifiers: Modifier[] = [];
    public profiles: UnitProfileDTO[] = [];
    public rules: Rule[] = [];
}