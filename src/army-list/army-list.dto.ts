import { ArmyList } from "./army-list.entity";
import { ArmyListUnitDTO } from "./army-list-unit/army-list-unit.dto";

export class ArmyListDTO {
    constructor(list: ArmyList) {
        this.name = list.name;
        this.cost = list.cost;
        this.isShared = list.isShared;
    }

    public name: string;
    public army: string;
    public cost: string;
    public units: ArmyListUnitDTO[] = [];
    public upgrades: string[] = [];
    public rules: string[] = [];
    public isShared: boolean;
}
