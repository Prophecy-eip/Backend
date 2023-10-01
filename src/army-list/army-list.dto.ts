import { ArmyList } from "./army-list.entity";
import { ArmyListUnitDTO } from "./army-list-unit/army-list-unit.dto";
import { ArmyListUnitCredentialsDTO } from "@army-list/army-list-unit/army-list-unit-credentials.dto";
import { IsArray, IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";

export class ArmyListDTO {
    constructor(list: ArmyList) {
        this.id = list.id;
        this.name = list.name;
        this.valuePoints = list.valuePoints;
        this.isShared = list.isShared;
        this.isFavorite = list.isFavorite;
        this.armyId = list.armyId;
        this.units = list.units.map((u: ArmyListUnit): ArmyListUnitDTO => new ArmyListUnitDTO(u));
    }

    public id: string;
    public name: string;
    public armyId: number;
    public valuePoints: number;
    public isShared: boolean;
    public isFavorite: boolean;
    public units: ArmyListUnitDTO[] = [];
}

export class ArmyListParameterDTO {
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public name: string;

    @IsNumber()
    @IsDefined()
    public armyId: number;

    @IsNumber()
    @IsDefined()
    @Min(1)
    public valuePoints: number;

    @IsDefined({ each: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArmyListUnitCredentialsDTO)
    public units: ArmyListUnitCredentialsDTO[];

    @IsDefined()
    @IsBoolean()
    public isShared: boolean;

    @IsDefined()
    @IsBoolean()
    public isFavorite: boolean;
}
