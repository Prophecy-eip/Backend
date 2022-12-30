import { ArmyList } from "./army-list.entity";
import { ArmyListUnitDTO } from "./army-list-unit/army-list-unit.dto";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";
import { ArmyListUnitMagicItemDTO } from "./army-list-unit/magic-item/army-list-unit-magic-item.dto";
import { ArmyListUnitMagicStandardDTO } from "./army-list-unit/magic-standard/army-list-unit-magic-standard.dto";
import { Troop } from "../army/unit/troop/troop.entity";

export class ArmyListDTO {
    constructor(list: ArmyList, units: ArmyListUnit[]) {
        this.id = list.id;
        this.name = list.name;
        this.cost = list.valuePoints;
        this.isShared = list.isShared;
        this.army = list.army
        for (const unit of units) {
            this.units.push(new ArmyListUnitDTO(unit));
        }
    }
    public id: string;
    public name: string;
    public army: number;
    public cost: string;
    public isShared: boolean;
    public units: ArmyListUnitDTO[] = [];
    public magicItems: ArmyListUnitMagicItemDTO[] = [];
    public magicStandards: ArmyListUnitMagicStandardDTO[] = [];
    public troops: Troop[] = [];
}
