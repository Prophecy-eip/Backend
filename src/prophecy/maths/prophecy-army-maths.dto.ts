import {ArmyListUnit} from "@army-list/army-list-unit/army-list-unit.entity";

class PlayerUnitMathDTO {

    constructor(unit: ArmyListUnit) {
        this.name = unit.unit.name;
        this.modifiers = [];
    }

    public name: string;
    modifiers: [];
}


export class ProphecyArmyMathRequestDTO {
    constructor(key: string, player1Units: ArmyListUnit[], player2Units: ArmyListUnit[]) {
        this.key = key;
        this.first_player = player1Units.map(e => new PlayerUnitMathDTO(e));
        this.second_player = player2Units.map(e => new PlayerUnitMathDTO(e));
    }

    public key: string;
    public first_player: PlayerUnitMathDTO[];
    public second_player: PlayerUnitMathDTO[];
}

export type ProphecyArmyMathResponseDTO = {
    first_player_score: number;
    second_player_score: number;
}
