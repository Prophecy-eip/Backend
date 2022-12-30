import { ArmyOrganisationDTO } from "./organisation/army-organisation.dto";
import { Army } from "./army.entity";
import { MagicItemCategory } from "./magic-item/category/magic-item-category.entity";
import { MagicItem } from "./magic-item/magic-item.entity";
import { MagicStandard } from "./magic-standard/magic-standard.entity";
import { EquipmentDTO } from "./equipment/equipment.dto";
import { SpecialRule } from "./special-rule/special-rule.entity";
import { UnitDTO } from "./unit/unit.dto";

export class ArmyDTO {
    constructor(army: Army) {
        this.id = army.id;
        this.name = army.name;
        this.versionId = army.versionId;
        this.categoryId = army.categoryId;
        this.source = army.source;
        this.equipmentLimits = army.equipmentLimits;
        this.specialRuleLimits = army.specialRuleLimits;
        for (const o of army.organisations)
            this.organisations.push(new ArmyOrganisationDTO(o));
        this.magicItemCategories = army.magicItemCategories;
        this.magicItems = army.magicItems;
        this.magicStandards = army.magicStandards;
        for (const e of army.equipments)
            this.equipments.push(new EquipmentDTO(e));
        this.specialRules = army.specialRules;
        for (const u of army.units)
            this.units.push(new UnitDTO(u));
    }

    public id: number;
    public name: string;
    public versionId: number;
    public categoryId: number;
    public source: string;
    public equipmentLimits: string;
    public specialRuleLimits: string;
    public organisations: ArmyOrganisationDTO[] = [];
    public magicItemCategories: MagicItemCategory[] = [];
    public magicItems: MagicItem[] = [];
    public magicStandards: MagicStandard[] = [];
    public equipments: EquipmentDTO[] = [];
    public specialRules: SpecialRule[] = [];
    public units: UnitDTO[] = [];
}
