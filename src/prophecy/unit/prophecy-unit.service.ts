import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ProphecyUnit, ProphecyUnitAttackingPosition, ProphecyUnitCase } from "./prophecy-unit.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ProphecyUnitMathsResponseDTO } from "@prophecy/maths/prophecy-unit-maths.dto";

export type ProphecyUnitServiceOptions = {
    loadAll?: boolean;
    loadAttackingRegimentUnit?: boolean;
    loadDefendingRegimentUnit?: boolean;
}

@Injectable()
export class ProphecyUnitService {
    constructor(
        @InjectRepository(ProphecyUnit)
        private repository: Repository<ProphecyUnit>
    ) {}

    public async create(
        owner: string,
        attackingRegimentUnit: ArmyListUnit,
        defendingRegimentUnit: ArmyListUnit,
        attackingPosition: ProphecyUnitAttackingPosition,
        mathsResponse: ProphecyUnitMathsResponseDTO): Promise<ProphecyUnit> {
        const id: string = randomUUID();
        const bestCase: ProphecyUnitCase = new ProphecyUnitCase(mathsResponse.best_case);
        const meanCase: ProphecyUnitCase = new ProphecyUnitCase(mathsResponse.mean_case);
        const worstCase: ProphecyUnitCase = new ProphecyUnitCase(mathsResponse.worst_case);

        return this.repository.create({ id: id, attackingRegimentUnit: attackingRegimentUnit,
            defendingRegimentUnit: defendingRegimentUnit, owner: owner, bestCase: bestCase, meanCase: meanCase,
            worstCase: worstCase, attackingPosition: attackingPosition
        });
    }

    public async save(prophecy: ProphecyUnit): Promise<ProphecyUnit> {
        return this.repository.save(prophecy);
    }

    public async findByOwner(owner: string, options?: ProphecyUnitServiceOptions): Promise<ProphecyUnit[]> {
        return this.repository.find({
            where: {owner: owner},
            relations: this._getRelations(options)
        });
    }

    public async findOneById(id: string, options?: ProphecyUnitServiceOptions): Promise<ProphecyUnit> {
        return this.repository.findOne({
            where: {id: id},
            relations: this._getRelations(options)
        });
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    private _getRelations(options: ProphecyUnitServiceOptions | undefined): string[] {
        let relations: string[] = [];
        if (options?.loadAll === true || options?.loadAttackingRegimentUnit === true) {
            relations.push("attackingRegimentUnit");
            relations.push("attackingRegimentUnit.unit");
            relations.push("attackingRegimentUnit.magicItems");
            relations.push("attackingRegimentUnit.magicStandards");
            relations.push("attackingRegimentUnit.options");
            relations.push("attackingRegimentUnit.specialRuleTroops");
            relations.push("attackingRegimentUnit.equipmentTroops");
            relations.push("attackingRegimentUnit.troops");
        }
        if (options?.loadAll === true || options?.loadDefendingRegimentUnit === true) {
            relations.push("defendingRegimentUnit");
            relations.push("defendingRegimentUnit.unit");
            relations.push("defendingRegimentUnit.magicItems");
            relations.push("defendingRegimentUnit.magicStandards");
            relations.push("defendingRegimentUnit.options");
            relations.push("defendingRegimentUnit.specialRuleTroops");
            relations.push("defendingRegimentUnit.equipmentTroops");
            relations.push("defendingRegimentUnit.troops");
        }
        return relations;
    }
}
