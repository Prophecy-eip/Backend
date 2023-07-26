import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnit } from "./army-list-unit.entity";
import { ArmyList } from "@army-list/army-list.entity";
import { Unit } from "@army/unit/unit.entity";
import { UnitService } from "@army/unit/troop/unit.service";

export type ArmyListUnitServiceOptions = {
    loadAll?: boolean;
    loadUnit?: boolean;
}

@Injectable()
export class ArmyListUnitService {
    constructor(
        @InjectRepository(ArmyListUnit)
        private readonly repository: Repository<ArmyListUnit>,
        private readonly unitService: UnitService
    ) {}


    async create(unitId: number, quantity: number, formation: string, troopIds: number[], armyList?: ArmyList): Promise<ArmyListUnit> {
        const id: string = randomUUID();
        const unit: Unit = await this.unitService.findOneById(unitId);

        return this.repository.create({ id, unit, quantity, formation, troopIds, armyList });
    }

    save(unit: ArmyListUnit): Promise<ArmyListUnit> {
        return this.repository.save(unit);
    }

    findByArmyList(listId: string): Promise<ArmyListUnit[]> {
        return this.repository.findBy({ armyList: { id: listId }});
    }

    async deleteByArmyList(listId: string): Promise<void> {
        await this.repository.delete({ armyList: { id : listId }});
    }
}
