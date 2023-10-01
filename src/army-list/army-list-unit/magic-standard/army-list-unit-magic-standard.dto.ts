import { ArmyListUnitMagicStandard } from "./army-list-unit-magic-standard.entity";
import { IsDefined, IsNumber, Min } from "class-validator";

export class    ArmyListUnitMagicStandardDTO {

    public static fromArmyListUnitMagicStandard(standard: ArmyListUnitMagicStandard): ArmyListUnitMagicStandardDTO {
        return {
            magicStandardId: standard.magicStandard.id,
            unitOptionId: standard.unitOption?.id ?? null,
            quantity: standard.quantity,
            valuePoints: standard.valuePoints
        };
    }

    @IsDefined()
    @IsNumber()
    public magicStandardId: number;

    public unitOptionId: number | null;

    @IsDefined()
    @IsNumber()
    @Min(1)
    public quantity: number;

    @IsDefined()
    @IsNumber()
    @Min(1)
    public valuePoints: number;
}
