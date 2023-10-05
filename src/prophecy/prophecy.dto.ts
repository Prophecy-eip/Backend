import {
    ProphecyArmyListUnitCredentialsDTO
} from "@army-list/army-list-unit/army-list-unit-credentials.dto";
import { ProphecyUnitAttackingPosition } from "@prophecy/unit/prophecy-unit.entity";
import { IsDefined, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ProphecyUnitRequestDTO {
    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => ProphecyArmyListUnitCredentialsDTO)
    public attackingRegiment: ProphecyArmyListUnitCredentialsDTO;

    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => ProphecyArmyListUnitCredentialsDTO)
    public defendingRegiment: ProphecyArmyListUnitCredentialsDTO;

    @IsDefined()
    @IsEnum(ProphecyUnitAttackingPosition)
    public attackingPosition: ProphecyUnitAttackingPosition;
}

export class ProphecyArmyRequestDTO {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    public armyList1: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    public armyList2: string;
}
