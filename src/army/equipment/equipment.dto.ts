import { Equipment } from "./equipment.entity";
import { EquipmentCategory } from "./category/equipment-category.entity";

export class EquipmentDTO {
    constructor(equipment: Equipment) {
        this.id = equipment.id;
        this.versionId = equipment.versionId;
        this.name = equipment.name;
        this.description = equipment.description;
        this.typeLvl = equipment.typeLvl;
        this.canBeEnchanted = equipment.canBeEnchanted;
        this.equipmentCategories = equipment.equipmentCategories;
    }

    public id: number;
    public versionId: number;
    public name: string;
    public description: string;
    public typeLvl: string;
    public canBeEnchanted: boolean;
    public equipmentCategories: EquipmentCategory[] = [];
}
