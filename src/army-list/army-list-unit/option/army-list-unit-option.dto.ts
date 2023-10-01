import { ArmyListUnitOption } from "./army-list-unit-option.entity";
import { IsDefined, IsNumber, Min } from "class-validator";

export class ArmyListUnitOptionDTO {
    public static fromArmyListUnitOption(option: ArmyListUnitOption): ArmyListUnitOptionDTO {
        return {
            unitId: option.unitId,
            optionId: option.option.id,
            quantity: option.quantity,
            valuePoints: option.valuePoints
        };
    }

    @IsDefined()
    @IsNumber()
    public unitId: number;

    @IsDefined()
    @IsNumber()
    public optionId: number;

    @IsDefined()
    @IsNumber()
    @Min(1)
    public quantity: number;

    @IsDefined()
    @IsNumber()
    @Min(1)
    public valuePoints: number;
}
