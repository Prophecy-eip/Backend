import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { UnitCharacteristic } from "@army/unit/unit.entity";
import { Troop, TroopCharacteristics } from "@army/unit/troop/troop.entity";
import { ProphecyUnitModifierGlobal } from "./prophecy-unit.entity";

export class ProphecyUnitModelStatsMathsDTO {
    constructor(unitCharacteristics: UnitCharacteristic, troopCharacteristics: TroopCharacteristics | undefined) {
        this.advance = (unitCharacteristics.adv !== null || true) ? +unitCharacteristics.adv : 0;
        this.march = (unitCharacteristics.mar !== null || true) ? +unitCharacteristics.mar : 0;
        this.discipline = (unitCharacteristics.dis !== null || true) ? +unitCharacteristics.dis : 0;
        this.health_points = (unitCharacteristics.hp !== null || true) ? +unitCharacteristics.hp : 0;
        this.defense = (unitCharacteristics.def !== null || true) ? +unitCharacteristics.def: 0;
        this.resilience = (unitCharacteristics.res !== null || true) ? +unitCharacteristics.res : 0;
        this.armour = (unitCharacteristics.arm !== null || true) ? +unitCharacteristics.arm : 0;
        this.aegis = (unitCharacteristics.aeg !== null || true) ? +unitCharacteristics.aeg : 0;
        this.attack = (troopCharacteristics !== undefined) ? +troopCharacteristics?.att : 0;
        this.offensive = (troopCharacteristics !== undefined) ? +troopCharacteristics?.of : 0;
        this.strength = (troopCharacteristics !== undefined) ? +troopCharacteristics?.str : 0;
        this.armour_penetration = (troopCharacteristics !== undefined) ? +troopCharacteristics?.ap : 0;
        this.agility = (troopCharacteristics !== undefined) ? +troopCharacteristics?.agi : 0;
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

    constructor(unitCharacteristics: UnitCharacteristic, troopCharacteristics: TroopCharacteristics | undefined) {
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
        this.model = new ProphecyUnitModelMathsDTO(unit.unit.characteristics, unit.troops[0]?.characteristics);
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
