import { ArmyListUnitMagicItem } from "./army-list-unit-magic-item.entity";
import { IsDefined, IsNumber, Min } from "class-validator";

export class ArmyListUnitMagicItemDTO {
    public static fromArmyListUnitMagicItem(item: ArmyListUnitMagicItem): ArmyListUnitMagicItemDTO {
        return {
            unitId: item.unitId,
            magicItemId: item.magicItem.id,
            unitOptionId: item.unitOption?.id ?? null,
            equipmentId: item.equipment?.id ?? null,
            quantity: item.quantity,
            valuePoints: item.valuePoints
        };
    }

    @IsDefined()
    @IsNumber()
    public unitId: number;

    @IsDefined()
    @IsNumber()
    public magicItemId: number;

    public unitOptionId: number | null;

    public equipmentId: number | null;

    @IsDefined()
    @IsNumber()
    @Min(1)
    public quantity: number;

    @IsDefined()
    @IsNumber()
    @Min(1)
    public valuePoints: number;
}
