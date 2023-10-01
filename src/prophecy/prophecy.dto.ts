import {
    ProphecyArmyListUnitCredentialsDTO
} from "@army-list/army-list-unit/army-list-unit-credentials.dto";
import { ProphecyUnitAttackingPosition } from "@prophecy/unit/prophecy-unit.entity";
import { IsDefined, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export class ProphecyUnitRequestDTO {
    @IsDefined()
    @Type(() => ProphecyArmyListUnitCredentialsDTO)
    public attackingRegiment: ProphecyArmyListUnitCredentialsDTO;

    @IsDefined()
    @Type(() => ProphecyArmyListUnitCredentialsDTO)
    public defendingRegiment: ProphecyArmyListUnitCredentialsDTO;

    @IsDefined()
    @IsEnum(ProphecyUnitAttackingPosition)
    public attackingPosition: ProphecyUnitAttackingPosition;
}
