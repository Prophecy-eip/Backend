import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitTroopSpecialRule } from "./army-list-unit-troop-special-rule.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";

@Injectable()
export class ArmyListUnitTroopSpecialRuleService {
    constructor(
        @InjectRepository(ArmyListUnitTroopSpecialRule)
        private repository: Repository<ArmyListUnitTroopSpecialRule>
    ) {}

    async create(armyListUnit: ArmyListUnit, troopId: number, ruleId: number): Promise<ArmyListUnitTroopSpecialRule> {
        const id: string = randomUUID();

        return this.repository.create({ id,  armyListUnit, troopId, ruleId });
    }

    async save(equipment: ArmyListUnitTroopSpecialRule): Promise<ArmyListUnitTroopSpecialRule> {
        return this.repository.save(equipment);
    }
}
