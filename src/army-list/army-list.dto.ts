import { ArmyList } from "./army-list.entity";
import { ArmyListUnitDTO } from "./army-list-unit/army-list-unit.dto";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";

export class ArmyListDTO {
    constructor(list: ArmyList, units: ArmyListUnit[]) {
        this.id = list.id;
        this.name = list.name;
        this.valuePoints = list.valuePoints;
        this.isShared = list.isShared;
        this.isFavorite = list.isFavorite;
        this.armyId = list.armyId;
        for (const unit of units) {
            this.units.push(new ArmyListUnitDTO(unit));
        }
    }
    public id: string;
    public name: string;
    public armyId: number;
    public valuePoints: number;
    public isShared: boolean;
    public isFavorite: boolean;
    public units: ArmyListUnitDTO[] = [];
}
