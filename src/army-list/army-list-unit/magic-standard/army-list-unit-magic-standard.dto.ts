import { ArmyListUnitMagicStandard } from "./army-list-unit-magic-standard.entity";

export class ArmyListUnitMagicStandardDTO {
    constructor(standard: ArmyListUnitMagicStandard) {
        this.magicStandardId = standard.magicStandard.id;
        this.unitOptionId = standard.unitOption?.id ?? null;
        this.quantity = standard.quantity;
        this.valuePoints = standard.valuePoints;
    }

    public magicStandardId: number;
    public unitOptionId: number | null;
    public quantity: number;
    public valuePoints: number;
}
