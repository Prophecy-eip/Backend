import { ArmyList } from "./army-list.entity";
import { ArmyListUnitDTO } from "./army-list-unit/army-list-unit.dto";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";

export class ArmyListDTO {
    constructor(list: ArmyList, units: ArmyListUnit[]) {
        this.name = list.name;
        this.cost = list.cost;
        this.isShared = list.isShared;
        for (const unit of units) {
            this.units.push(new ArmyListUnitDTO(unit));
        }
        this.rules = list.rules;
        this.upgrades = list.upgrades;
    }

    public name: string;
    public army: string;
    public cost: string;
    public units: ArmyListUnitDTO[] = [];
    public upgrades: string[] = [];
    public rules: string[] = [];
    public isShared: boolean;
}
