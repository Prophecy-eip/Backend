import { ArmyListUnit } from "./army-list-unit.entity";
import { UnitDTO } from "../../army/unit/unit.dto";
import { OptionDTO } from "../../army/option/option.dto";
import { UpgradeDTO } from "../../army/upgrade/upgrade.dto";

export class ArmyListUnitDTO {
    constructor(unit: ArmyListUnit) {
        // this.id = unit.id;
        // this.unit = new UnitDTO(unit.unit.id);
        this.unitId = unit.unit;
        for (const option of unit.options) {
            this.options.push(new OptionDTO(option));
        }
        for (const upgrade of unit.upgrades) {
            this.upgrades.push(new UpgradeDTO(upgrade));
        }
        this.number = unit.number;
        this.formation = unit.formation;
    }

    // public id: string;
    public unitId: string;
    public options: OptionDTO[] = [];
    public upgrades: UpgradeDTO[] = [];
    public number: number;
    public formation: string;
}