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

    async create(unitId: number, quantity: number, formation: string, armyListId: string, troopIds: number[]): Promise<ArmyListUnit> {
        const id: string = randomUUID();

        return this.repository.create({ id, unitId, quantity, formation, armyListId, troopIds });
    }

    save(unit: ArmyListUnit): Promise<ArmyListUnit> {
        return this.repository.save(unit);
    }

    findByArmyList(listId: string): Promise<ArmyListUnit[]> {
        return this.repository.findBy({ armyListId: listId });
    }

    async deleteByList(listId: string): Promise<void> {
        await this.repository.delete({ armyListId: listId });
    }
}
