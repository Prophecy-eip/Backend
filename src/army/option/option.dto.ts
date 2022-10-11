import { Modifier } from "../modifier/modifier.entity";
import { Rule } from "../rule/rule.entity";
import { Option } from "./option.entity";

export class OptionDTO {
    constructor(option: Option) {
        this.id = option.id;
        this.name = option.name;
        this.type = option.type;
        this.limits = option.limits;
        this.cost = option.cost;
        this.modifiers = option.modifiers;
        this.rules = option.rules;
    }

    public id: string;
    public name: string;
    public type: string;
    public limits: string;
    public cost: string;
    public modifiers: Modifier[] = [];
    public rules: Rule[] = [];
}
