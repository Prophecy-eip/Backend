import { ArmyListUnitMagicItem } from "./army-list-unit-magic-item.entity";

export class ArmyListUnitMagicItemDTO {
    constructor(item: ArmyListUnitMagicItem) {
        this.unitId = item.unitId;
        this.magicItemId = item.magicItemId;
        this.unitOptionId = item.unitOptionId;
        this.equipmentId = item.equipmentId;
        this.quantity = item.quantity;
        this.valuePoints = item.valuePoints;
    }

    public unitId: number;
    public magicItemId: number;
    public unitOptionId: number;
    public equipmentId: number;
    public quantity: number;
    public valuePoints: number;
}