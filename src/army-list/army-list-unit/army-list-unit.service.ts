import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnit } from "./army-list-unit.entity";

@Injectable()
export class ArmyListUnitService {
    constructor(
        @InjectRepository(ArmyListUnit)
        private readonly repository: Repository<ArmyListUnit>
    ) {}

    async create(unit: string, number: number, formation: string, armyList: string): Promise<ArmyListUnit> {
        const id: string = randomUUID()
        return this.repository.create({ id, unit, number, formation, armyList });
    }

    save(unit: ArmyListUnit): Promise<ArmyListUnit> {
        return this.repository.save(unit);
    }

    findByArmyList(list: string): Promise<ArmyListUnit[]> {
        return this.repository.findBy({ armyList: list });
    }
}
