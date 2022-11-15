import { ArmyListUnit } from "./army-list-unit.entity";

export class ArmyListUnitDTO {
    constructor(unit: ArmyListUnit) {
        this.unitId = unit.unit;
        this.number = unit.number;
        this.formation = unit.formation;
    }

    public unitId: string;
    public options: string[] = [];
    public upgrades: string[] = [];
    public number: number;
    public formation: string;
}
