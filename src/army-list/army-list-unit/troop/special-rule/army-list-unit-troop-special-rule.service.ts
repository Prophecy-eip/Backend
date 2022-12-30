import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitTroopSpecialRule } from "./army-list-unit-troop-special-rule.entity";

@Injectable()
export class ArmyListUnitTroopSpecialRuleService {
    constructor(
        @InjectRepository(ArmyListUnitTroopSpecialRule)
        private repository: Repository<ArmyListUnitTroopSpecialRule>
    ) {}

    async create(armyListUnitId: string, troopId: number, ruleId: number): Promise<ArmyListUnitTroopSpecialRule> {
        const id: string = randomUUID();

        return this.repository.create({ id,  armyListUnitId, troopId, ruleId });
    }

    async save(equipment: ArmyListUnitTroopSpecialRule): Promise<ArmyListUnitTroopSpecialRule> {
        return this.repository.save(equipment);
    }
}
