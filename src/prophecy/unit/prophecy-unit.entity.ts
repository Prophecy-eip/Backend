import { AfterLoad, Column, Entity, PrimaryColumn } from "typeorm";

import {
    ProphecyUnitCaseMathsDTO,
    ProphecyUnitModelMathsDTO, ProphecyUnitModelStatsMathsDTO, ProphecyUnitModifierMathsDTO,
    ProphecyUnitRegimentMathsDTO
} from "./prophecy-unit-maths.dto";
import { ArmyListUnit } from "../../army-list/army-list-unit/army-list-unit.entity";
import { ProphecyDatasource } from "../../database/prophecy.datasource";

class ProphecyUnitModelStats {
    constructor(stats: ProphecyUnitModelStatsMathsDTO) {
        this.advance = stats.advance;
        this.march = stats.march;
        this.discipline = stats.discipline;
        this.healthPoint = stats.health_point;
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

class ProphecyUnitModifier {
    constructor(modifier: ProphecyUnitModifierMathsDTO) {
        this.stats = new ProphecyUnitModelStats(modifier.stat);
        this.bonus = modifier.bonus;
        this.nbDice = modifier.nb_dice;
        this.requirements = modifier.requirements;
    }

    public stats: ProphecyUnitModelStats;
    public bonus: boolean;
    public nbDice: number;
    public requirements: any[] = [];
}

class ProphecyUnitModel {
    constructor(model: ProphecyUnitModelMathsDTO) {
        this.stats = new ProphecyUnitModelStats(model.stats)
        for (const modifier of model.modifiers) {
            this.modifiers.push(new ProphecyUnitModifier(modifier));
        }
    }

    public stats: ProphecyUnitModelStats;
    public modifiers: ProphecyUnitModifier[] = [];
}

export class ProphecyUnitRegiment {
    constructor(regiment: ProphecyUnitRegimentMathsDTO) {
        this.model = new ProphecyUnitModel(regiment.model)
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

export class ProphecyUnitCase {
    constructor(caseDto: ProphecyUnitCaseMathsDTO) {
        this.attackingRegiment = new ProphecyUnitRegiment(caseDto.attacking_regiment);
        this.defendingRegiment = new ProphecyUnitRegiment(caseDto.attacking_regiment);
        this.occurrenceProbability = caseDto.occurrence_probability;
    }

    public attackingRegiment: ProphecyUnitRegiment;
    public defendingRegiment: ProphecyUnitRegiment;
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
