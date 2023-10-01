import { ArmyListUnitMagicItemDTO } from "./magic-item/army-list-unit-magic-item.dto";
import { ArmyListUnitMagicStandardDTO } from "./magic-standard/army-list-unit-magic-standard.dto";
import { ArmyListUnitOptionDTO } from "./option/army-list-unit-option.dto";
import { ArmyListUnitTroopSpecialRuleDTO } from "./troop/special-rule/army-list-unit-troop-special-rule.dto";
import { ArmyListUnitTroopEquipmentDTO } from "./troop/equipment/army-list-unit-troop-equipment.dto";
import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ArmyListUnitCredentialsDTO {

    @IsDefined()
    @IsNumber()
    public unitId: number;

    @IsDefined()
    @IsNumber()
    @Min(1)
    public quantity: number;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    public formation: string;

    @IsDefined({ each: true })
    @IsArray()
    public troopIds: number[];

    @IsDefined({ each: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArmyListUnitMagicItemDTO)
    public magicItems: ArmyListUnitMagicItemDTO[];

    @IsDefined({ each: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArmyListUnitMagicStandardDTO)
    public magicStandards: ArmyListUnitMagicStandardDTO[];

    @IsDefined({ each: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArmyListUnitOptionDTO)
    public options: ArmyListUnitOptionDTO[];

    @IsDefined({ each: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArmyListUnitTroopSpecialRuleDTO)
    public specialRuleTroops: ArmyListUnitTroopSpecialRuleDTO[];

    @IsDefined({ each: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArmyListUnitTroopEquipmentDTO)
    public equipmentTroops: ArmyListUnitTroopEquipmentDTO[];
}
