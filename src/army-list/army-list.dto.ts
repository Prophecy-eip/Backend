import { ArmyList } from "./army-list.entity";
import {ArmyListUnitDTO} from "./army-list-unit/army-list-unit.dto";

export class ArmyListDTO {
    constructor(list: ArmyList) {
        // this.id = list.id;
        this.name = list.name;
        this.army = list.army.id;
        this.cost = list.cost;
        for (const unit of list.units) {
            this.units.push(new ArmyListUnitDTO(unit));
        }
        for (const upgrade of list.upgrades) {
            this.upgrades.push(upgrade.id)
        }
        for (const rule of list.rules) {
            this.rules.push(rule.id);
        }
        this.isShared = list.isShared;
    }

    // public id: string;
    public name: string;
    public army: string;
    public cost: string;
    public units: ArmyListUnitDTO[] = [];
    public upgrades: string[] = [];
    public rules: string[] = [];
    public isShared: boolean;
}