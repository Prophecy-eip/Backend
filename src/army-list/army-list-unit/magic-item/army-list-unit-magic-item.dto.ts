import { ArmyListUnitMagicItem } from "./army-list-unit-magic-item.entity";

export class ArmyListUnitMagicItemDTO {
    constructor(item: ArmyListUnitMagicItem) {
        this.unitId = item.unitId;
        this.magicItemId = item.magicItem.id;
        this.unitOptionId = item.unitOption?.id ?? null;
        this.equipmentId = item.equipment?.id ?? null;
        this.quantity = item.quantity;
        this.valuePoints = item.valuePoints;
    }

    public unitId: number;
    public magicItemId: number;
    public unitOptionId: number | null;
    public equipmentId: number | null;
    public quantity: number;
    public valuePoints: number;
}
