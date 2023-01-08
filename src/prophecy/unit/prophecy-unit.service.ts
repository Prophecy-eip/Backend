import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ProphecyUnit, ProphecyUnitCase } from "./prophecy-unit.entity";
import { ProphecyUnitMathsResponseDTO } from "./prophecy-unit-maths.dto";

@Injectable()
export class ProphecyUnitService {
    constructor(
        @InjectRepository(ProphecyUnit)
        private repository: Repository<ProphecyUnit>
    ) {}

    public async create(
        owner: string,
        attackingRegimentUnitId: string,
        defendingRegimentUnitId: string,
        mathsResponse: ProphecyUnitMathsResponseDTO): Promise<ProphecyUnit> {
        const id: string = randomUUID();
        const bestCase: ProphecyUnitCase = new ProphecyUnitCase(mathsResponse.BEST);
        const meanCase: ProphecyUnitCase = new ProphecyUnitCase(mathsResponse.MEAN);
        const worstCase: ProphecyUnitCase = new ProphecyUnitCase(mathsResponse.WORST);

        return this.repository.create({ id, attackingRegimentUnitId, defendingRegimentUnitId, owner, bestCase, meanCase,
            worstCase
        });
    }

    public async save(prophecy: ProphecyUnit): Promise<ProphecyUnit> {
        return this.repository.save(prophecy);
    }

    public async findByOwner(owner: string): Promise<ProphecyUnit[]> {
        return this.repository.findBy({ owner: owner });
    }
}
