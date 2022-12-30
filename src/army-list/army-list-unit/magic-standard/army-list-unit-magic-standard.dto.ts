import { ArmyListUnitMagicStandard } from "./army-list-unit-magic-standard.entity";

export class ArmyListUnitMagicStandardDTO {
    constructor(standard: ArmyListUnitMagicStandard) {
        this.magicStandardId = standard.magicStandardId;
        this.unitOptionId = standard.unitOptionId;
        this.quantity = standard.quantity;
        this.valuePoints = standard.valuePoints;
    }

    public magicStandardId: number;
    public unitOptionId: number;
    public quantity: number;
    public valuePoints: number;
}
