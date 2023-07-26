import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnit } from "./army-list-unit.entity";
import { ArmyList } from "@army-list/army-list.entity";

@Injectable()
export class ArmyListUnitService {
    constructor(
        @InjectRepository(ArmyListUnit)
        private readonly repository: Repository<ArmyListUnit>
    ) {}

    async create(unitId: number, quantity: number, formation: string, troopIds: number[], armyList?: ArmyList): Promise<ArmyListUnit> {
        const id: string = randomUUID();

        return this.repository.create({ id, unitId, quantity, formation, troopIds, armyList });
    }

    save(unit: ArmyListUnit): Promise<ArmyListUnit> {
        return this.repository.save(unit);
    }

    findByArmyList(listId: string): Promise<ArmyListUnit[]> {
        return this.repository.findBy({ armyList: { id: listId }});
    }

    async deleteByList(listId: string): Promise<void> {
        await this.repository.delete({ armyList: { id : listId }});
    }
}
