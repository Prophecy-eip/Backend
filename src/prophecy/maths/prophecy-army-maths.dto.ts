import { ProphecyModelMathsDTO } from "@prophecy/maths/prophecy-maths.dto";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";

class PlayerUnitMathDTO {

    public static async create(unit:ArmyListUnit): Promise<PlayerUnitMathDTO> {
        return {
            unit: {
                model: await ProphecyModelMathsDTO.create(unit)
            }
        };
    }

    public unit: {
        model: ProphecyModelMathsDTO
    };

}

class PlayerMathsDTO {
    public static async create(units: ArmyListUnit[]): Promise<PlayerMathsDTO> {
        return {
            units: await Promise.all(units.map(async (u: ArmyListUnit): Promise<PlayerUnitMathDTO> => await PlayerUnitMathDTO.create(u)))
        };
    }

    public units: PlayerUnitMathDTO[];
}

export class ProphecyArmyMathRequestDTO {
    public static async create(key: string, player1Units: ArmyListUnit[], player2Units: ArmyListUnit[]): Promise<ProphecyArmyMathRequestDTO> {
        return {
            key,
            first_player: await PlayerMathsDTO.create(player1Units),
            second_player: await PlayerMathsDTO.create(player2Units)
        };
    }

    public key: string;
    public first_player: PlayerMathsDTO;
    public second_player: PlayerMathsDTO;
}

export type ProphecyArmyMathResponseDTO = {
    first_player_score: number;
    second_player_score: number;
}
