import { ProphecyModelMathsDTO } from "@prophecy/maths/prophecy-maths.dto";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";

class PlayerUnitMathDTO {

    constructor(unit: ArmyListUnit) {
        this.unit = {
            model: new ProphecyModelMathsDTO(unit)
        };
    }

    public unit: {
        model: ProphecyModelMathsDTO
    };

}

class PlayerMathsDTO {
    constructor(units: ArmyListUnit[]) {
        this.units = units.map((u: ArmyListUnit): PlayerUnitMathDTO => new PlayerUnitMathDTO(u));
    }

    public units: PlayerUnitMathDTO[];
}

export class ProphecyArmyMathRequestDTO {
    constructor(key: string, player1Units: ArmyListUnit[], player2Units: ArmyListUnit[]) {
        this.key = key;
        this.first_player = new PlayerMathsDTO(player1Units);
        this.second_player = new PlayerMathsDTO(player2Units);
    }

    public key: string;
    public first_player: PlayerMathsDTO;
    public second_player: PlayerMathsDTO;
}

export type ProphecyArmyMathResponseDTO = {
    first_player_score: number;
    second_player_score: number;
}
