import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Unit } from "./unit.entity"

@Injectable()
export class UnitService {
    constructor(
        @InjectRepository(Unit)
        private repository: Repository<Unit>
    ) {}

    async findAllByArmy(armyId: string): Promise<Unit[]> {
        return await this.repository.findBy([{ army: armyId }]);
    }
}