import { ArmyListUnit } from "../../army-list/army-list-unit/army-list-unit.entity";
import { UnitCharacteristic } from "../../army/unit/unit.entity";
import { Troop, TroopCharacteristics } from "../../army/unit/troop/troop.entity";
import { ProphecyUnitModifierGlobal } from "./prophecy-unit.entity";

export class ProphecyUnitModelStatsMathsDTO {
    constructor(unitCharacteristics: UnitCharacteristic, troopCharacteristics: TroopCharacteristics) {
        this.advance = +unitCharacteristics.adv;
        this.march = +unitCharacteristics.mar;
        this.discipline = +unitCharacteristics.dis;
        this.health_points = +unitCharacteristics.hp;
        this.defense = +unitCharacteristics.def;
        this.resilience = +unitCharacteristics.res;
        this.armour = +unitCharacteristics.arm;
        this.aegis = +unitCharacteristics.aeg;
        this.attack = +troopCharacteristics.att;
        this.offensive = +troopCharacteristics.of;
        this.strength = +troopCharacteristics.str;
        this.armour_penetration = +troopCharacteristics.ap;
        this.agility = +troopCharacteristics.agi;
    }

    public advance: number;
    public march: number;
    public discipline: number;
    public health_points: number;
    public defense: number;
    public resilience: number;
    public armour: number;
    public aegis: number;
    public attack: number;
    public offensive: number;
    public strength: number;
    public armour_penetration: number;
    public agility: number;
}

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
    public  offensive: ProphecyUnitModifierOffensiveMathsDTO;
}

export class ProphecyUnitModelMathsDTO {

    constructor(unitCharacteristics: UnitCharacteristic, troopCharacteristics: TroopCharacteristics) {
        this.stats = new ProphecyUnitModelStatsMathsDTO(unitCharacteristics, troopCharacteristics);
        this.modifiers = []; // TODO
        this.banner_bearer = false; // TODO
    }
    public stats: ProphecyUnitModelStatsMathsDTO;
    public modifiers: ProphecyUnitModifierMathsDTO[];
    public banner_bearer: boolean;
}
export class ProphecyUnitRegimentMathsDTO {
    constructor(unit: ArmyListUnit) {
        let pos: number = unit.formation.indexOf("x");
        this.model = new ProphecyUnitModelMathsDTO(unit.unit.characteristics, unit.troops[0].characteristics);
        this.nb_rows = +unit.formation.substring(pos + 1);
        this.nb_cols = +unit.formation.substring(0, pos);
        this.nb_models = unit.quantity;
        this.regiment_health_point = +unit.unit.characteristics.hp;
        this.points = 0;
    }
    public model: ProphecyUnitModelMathsDTO;
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
    public occurrence_probability: number;
}

export class ProphecyUnitMathsRequestDTO {
    constructor(key: string, attackingRegiment: ArmyListUnit, defendingRegiment: ArmyListUnit, attackingPosition: string) {
        this.key = key;
        this.attacking_regiment = new ProphecyUnitRegimentMathsDTO(attackingRegiment)
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
    public average_case: ProphecyUnitCaseMathsDTO;
    public best_case: ProphecyUnitCaseMathsDTO;
}
