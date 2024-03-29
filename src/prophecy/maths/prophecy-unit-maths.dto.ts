import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ProphecyUnitModifierGlobal } from "../unit/prophecy-unit.entity";
import { ProphecyModelMathsDTO } from "@prophecy/maths/prophecy-maths.dto";

export class ProphecyUnitModifierDefensiveMathsDTO {
    public health_points: number;
    public defense: number;
    public resilience: number;
    public armor: number;
}

export class ProphecyUnitModifierOffensiveMathsDTO {
    public attack: number;
    public offensive: number;
    public strength: number;
    public armor_penetration: number;
    public agility: number;
}

export class ProphecyUnitModifierMathsDTO {
    public global: ProphecyUnitModifierGlobal;
    public defensive: ProphecyUnitModifierDefensiveMathsDTO;
    public offensive: ProphecyUnitModifierOffensiveMathsDTO;
}

export class ProphecyUnitRegimentMathsDTO {
    constructor(unit: ArmyListUnit) {
        let pos: number = unit.formation.indexOf("x");
        this.model = new ProphecyModelMathsDTO(unit);
        this.nb_rows = +unit.formation.substring(pos + 1);
        this.nb_cols = +unit.formation.substring(0, pos);
        this.nb_models = unit.quantity;
        this.regiment_health_point = +unit.unit.characteristics.hp;
        this.points = 0;
    }
    public model: ProphecyModelMathsDTO;
    public nb_rows: number;
    public nb_cols: number;
    public nb_models: number;
    public regiment_health_point: number;
    public points: number;
}

export class ProphecyUnitCaseRegimentMathsDTO {
    public nb_rows: number;
    public nb_cols: number;
    public nb_models: number;
    public points: number;
}

export class ProphecyUnitCaseMathsDTO {
    public attacking_regiment: ProphecyUnitCaseRegimentMathsDTO;
    public defending_regiment: ProphecyUnitCaseRegimentMathsDTO;
    public probability: number;
}

export class ProphecyUnitMathsRequestDTO {
    constructor(key: string, attackingRegiment: ArmyListUnit, defendingRegiment: ArmyListUnit, attackingPosition: string) {
        this.key = key;
        this.attacking_regiment = new ProphecyUnitRegimentMathsDTO(attackingRegiment);
        this.defending_regiment = new ProphecyUnitRegimentMathsDTO(defendingRegiment);
        this.attacking_position = attackingPosition;
    }

    public key: string;
    public attacking_position: string;
    public attacking_regiment: ProphecyUnitRegimentMathsDTO;
    public defending_regiment: ProphecyUnitRegimentMathsDTO;
}

export class ProphecyUnitMathsResponseDTO {
    public worst_case: ProphecyUnitCaseMathsDTO;
    public mean_case: ProphecyUnitCaseMathsDTO;
    public best_case: ProphecyUnitCaseMathsDTO;
}
