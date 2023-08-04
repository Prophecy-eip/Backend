import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ProphecyUnit, ProphecyUnitAttackingPosition, ProphecyUnitCase } from "./prophecy-unit.entity";
import { ProphecyUnitMathsResponseDTO } from "./prophecy-unit-maths.dto";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";

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

    public async findByOwner(owner: string): Promise<ProphecyUnit[]> {
        return this.repository.findBy({ owner: owner });
    }

    public async findOneById(id: string): Promise<ProphecyUnit> {
        return this.repository.findOneBy({ id: id });
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
