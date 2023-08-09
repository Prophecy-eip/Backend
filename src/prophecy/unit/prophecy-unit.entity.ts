import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import {
    ProphecyUnitCaseMathsDTO, ProphecyUnitCaseRegimentMathsDTO
} from "../maths/prophecy-unit-maths.dto";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";

export enum ProphecyUnitAttackingPosition {
    FRONT = "front",
    FLANK = "flank",
    BACK = "back"
}

export class ProphecyUnitModifierGlobal {
    public advance: number;
    public march: number;
    public discipline: number;
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

    @OneToOne(() => ArmyListUnit)
    @JoinColumn({ name: "attacking_regiment_unit_id" })
    public attackingRegimentUnit: ArmyListUnit;

    @OneToOne(() => ArmyListUnit)
    @JoinColumn({ name: "defending_regiment_unit_id" })
    public defendingRegimentUnit: ArmyListUnit;
}
