import { Troop } from "./troop/troop.entity";
import { SpecialRuleUnitTroop } from "./troop/special-rule/special-rule-unit-troop.entity";
import { EquipmentUnitTroop } from "./troop/equipment/equipment-unit-troop.entity";
import { UnitOptionDTO } from "./option/unit-option.dto";
import { Unit, UnitCharacteristic } from "./unit.entity";

export class UnitDTO {
    constructor(unit: Unit) {
        this.id = unit.id;
        this.name = unit.name;
        this.unitCategoryId = unit.unitCategoryId;
        this.principalOrganisationId = unit.principalOrganisationId;
        this.minSize = unit.minSize;
        this.maxSize = unit.maxSize;
        this.canBeGeneralAndBsb = unit.canBeGeneralAndBsb;
        this.position = unit.position;
        this.magic = unit.magic;
        this.notes = unit.notes;
        this.isMount = unit.isMount;
        this.unitTypeId = unit.unitTypeId;
        this.armyOrganisationId = unit.armyOrganisationId;
        this.valuePoints = unit.valuePoints;
        this.addValuePoints = unit.addValuePoints;
        this.characteristics = unit.characteristics;
        this.troops = unit.troops;
        this.specialRuleUnitTroops = unit.specialRuleUnitTroops;
        this.equipmentUnitTroops = unit.equipmentUnitTroops;
        for (const o of unit.unitOptions)
            this.unitOptions.push(new UnitOptionDTO(o));
    }

    public id: number;
    public name: string;
    public unitCategoryId: number;
    public principalOrganisationId: number;
    public minSize: number;
    public maxSize: number;
    public canBeGeneralAndBsb: boolean;
    public position: number;
    public magic: string;
    public notes: string;
    public isMount: boolean;
    public unitTypeId: number;
    public armyOrganisationId: number;
    public valuePoints: number;
    public addValuePoints: number;
    public characteristics: UnitCharacteristic;
    public troops: Troop[] = [];
    public specialRuleUnitTroops: SpecialRuleUnitTroop[] = [];
    public equipmentUnitTroops: EquipmentUnitTroop[] = [];
    public unitOptions: UnitOptionDTO[] = [];
}
