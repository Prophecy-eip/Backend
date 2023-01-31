import { ProphecyUnit, ProphecyUnitAttackingPosition, ProphecyUnitCase } from "./prophecy-unit.entity";
import { ArmyListUnitDTO } from "../../army-list/army-list-unit/army-list-unit.dto";

export class ProphecyUnitDTO {
    constructor(prophecy: ProphecyUnit) {
        this.attackingRegiment = new ArmyListUnitDTO(prophecy.attackingRegimentUnit);
        this.defendingRegiment = new ArmyListUnitDTO(prophecy.defendingRegimentUnit);
        this.meanCase = prophecy.meanCase;
        this.bestCase = prophecy.bestCase;
        this.worstCase = prophecy.worstCase;
        this.attackingPosition = prophecy.attackingPosition;
    }

    public attackingRegiment: ArmyListUnitDTO;
    public defendingRegiment: ArmyListUnitDTO;
    public attackingPosition: ProphecyUnitAttackingPosition;
    public bestCase: ProphecyUnitCase;
    public meanCase: ProphecyUnitCase;
    public worstCase: ProphecyUnitCase;
}

export class ProphecyUnitWithIdDTO extends ProphecyUnitDTO {
    constructor(prophecy: ProphecyUnit) {
        super(prophecy);
        this.id = prophecy.id;
    }
    public id: string;
}
