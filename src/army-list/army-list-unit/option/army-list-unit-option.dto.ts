import { ArmyListUnitOption } from "./army-list-unit-option.entity";

export class ArmyListUnitOptionDTO {
    constructor(option: ArmyListUnitOption) {
        this.unitId = option.unitId;
        this.optionId = option.optionId;
        this.quantity = option.quantity;
        this.valuePoints = option.valuePoints;
    }

    public unitId: number;
    public optionId: number;
    public quantity: number;
    public valuePoints: number;
}
