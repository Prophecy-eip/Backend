import { AfterLoad, Column, Entity, PrimaryColumn } from "typeorm";

import {
    ProphecyUnitCaseMathsDTO, ProphecyUnitCaseRegimentMathsDTO,
    ProphecyUnitModelMathsDTO,
    ProphecyUnitModelStatsMathsDTO, ProphecyUnitModifierDefensiveMathsDTO,
    ProphecyUnitModifierMathsDTO,
    ProphecyUnitModifierOffensiveMathsDTO,
    ProphecyUnitRegimentMathsDTO
} from "./prophecy-unit-maths.dto";
import { ArmyListUnit } from "../../army-list/army-list-unit/army-list-unit.entity";
import { ProphecyDatasource } from "../../database/prophecy.datasource";

export enum ProphecyUnitAttackingPosition {
    FRONT = "front",
    FLANK = "flank",
    BACK = "back"
}

class ProphecyUnitModelStats {
    constructor(stats: ProphecyUnitModelStatsMathsDTO) {
        this.advance = stats.advance;
        this.march = stats.march;
        this.discipline = stats.discipline;
        this.healthPoint = stats.health_points;
        this.defense = stats.defense;
        this.resilience = stats.resilience;
        this.armour = stats.armour;
        this.aegis = stats.aegis;
        this.attack = stats.attack;
        this.offensive = stats.offensive;
        this.strength = stats.strength;
        this.armourPenetration = stats.armour_penetration;
        this.agility = stats.agility;
    }

    public advance: number;
    public march: number;
    public discipline: number;
    public healthPoint: number;
    public defense: number;
    public resilience: number;
    public armour: number;
    public aegis: number;
    public attack: number;
    public offensive: number;
    public strength: number;
    public armourPenetration: number;
    public agility: number;
}


export class ProphecyUnitModifierGlobal {
    public advance: number;
    public march: number;
    public discipline: number;
}

class ProphecyUnitModifierDefensive {
    constructor(defensive: ProphecyUnitModifierDefensiveMathsDTO) {
        this.healthPoint = defensive.health_points;
        this.defense = defensive.defense;
        this.resilience = defensive.resilience;
        this.armor = defensive.armor;
    }

    public healthPoint: number;
    public defense: number;
    public resilience: number;
    public armor: number;
}

class ProphecyUnitModifierOffensive {
    constructor(offensive: ProphecyUnitModifierOffensiveMathsDTO) {
        this.attack = offensive.attack;
        this.offensive = offensive.offensive;
        this.strength = offensive.strength;
        this.armorPenetration = offensive.armor_penetration;
        this.agility = offensive.agility;
    }

    public attack: number;
    public offensive: number;
    public strength: number;
    public armorPenetration: number;
    public agility: number;
}

class ProphecyUnitModifier {
    constructor(modifier: ProphecyUnitModifierMathsDTO) {
        this.global = modifier.global;
        this.defensive = new ProphecyUnitModifierDefensive(modifier.defensive);
        this.offensive = new ProphecyUnitModifierOffensive(modifier.offensive);
    }

    public global: ProphecyUnitModifierGlobal;
    public defensive: ProphecyUnitModifierDefensive;
    public offensive: ProphecyUnitModifierOffensive;
}

class ProphecyUnitModel {
    constructor(model: ProphecyUnitModelMathsDTO) {
        this.stats = new ProphecyUnitModelStats(model.stats);
        for (const modifier of model.modifiers) {
            this.modifiers.push(new ProphecyUnitModifier(modifier));
        }
    }

    public stats: ProphecyUnitModelStats;
    public modifiers: ProphecyUnitModifier[] = [];
}

export class ProphecyUnitRegiment {
    constructor(regiment: ProphecyUnitRegimentMathsDTO) {
        this.model = new ProphecyUnitModel(regiment.model);
        this.nbRows = regiment.nb_rows;
        this.nbCols = regiment.nb_cols;
        this.regimentHealthPoints = regiment.regiment_health_point;
        this.points = regiment.points;
    }

    public model: ProphecyUnitModel;
    public nbRows: number;
    public nbCols: number;
    public regimentHealthPoints: number;
    public points: number;
}

class ProphecyUnitCaseRegiment {
    constructor(regiment: ProphecyUnitCaseRegimentMathsDTO) {
        this.nbRows = regiment.nb_rows;
        this.nbCols = regiment.nb_cols;
        this.nbModels = regiment.nb_models;
        this.points = regiment.points;
    }

    public nbRows: number;
    public nbCols: number;
    public nbModels: number;
    public points: number;
}

export class ProphecyUnitCase {
    constructor(caseDto: ProphecyUnitCaseMathsDTO) {
        this.attackingRegiment = new ProphecyUnitCaseRegiment(caseDto.attacking_regiment);
        this.defendingRegiment = new ProphecyUnitCaseRegiment(caseDto.attacking_regiment);
        this.occurrenceProbability = caseDto.probability;
    }

    public attackingRegiment: ProphecyUnitCaseRegiment;
    public defendingRegiment: ProphecyUnitCaseRegiment;
    public occurrenceProbability: number;
}

@Entity("unit_prophecies")
export class ProphecyUnit {
    @PrimaryColumn()
    public id: string;

    @Column({ name: "attacking_regiment_unit_id" })
    public attackingRegimentUnitId: string;

    @Column({ name: "defending_regiment_unit_id" })
    public defendingRegimentUnitId: string;

    @Column()
    public owner: string;

    @Column({ name: "best_case", type: "json" })
    public bestCase: ProphecyUnitCase;

    @Column({ name: "mean_case", type: "json" })
    public meanCase: ProphecyUnitCase;

    @Column({ name: "worst_case", type: "json" })
    public worstCase: ProphecyUnitCase;

    @Column({ name: "attacking_position", type: "enum", enum: ProphecyUnitAttackingPosition })
    public attackingPosition: ProphecyUnitAttackingPosition;
    public attackingRegimentUnit: ArmyListUnit;
    public defendingRegimentUnit: ArmyListUnit;

    @AfterLoad()
    public async load() {
        let datasource: ProphecyDatasource = new ProphecyDatasource();

        await datasource.initialize();
        this.attackingRegimentUnit = await datasource.getRepository(ArmyListUnit)
            .findOneBy({ id: this.attackingRegimentUnitId });
        this.defendingRegimentUnit = await datasource.getRepository(ArmyListUnit)
            .findOneBy({ id: this.defendingRegimentUnitId });
        await datasource.destroy();
    }
}
