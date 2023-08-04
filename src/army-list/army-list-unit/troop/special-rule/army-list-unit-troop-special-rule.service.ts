import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitTroopSpecialRule } from "./army-list-unit-troop-special-rule.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import {
    ArmyListUnitTroopSpecialRuleDTO
} from "@army-list/army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.dto";

@Injectable()
export class ArmyListUnitTroopSpecialRuleService {
    constructor(
        @InjectRepository(ArmyListUnitTroopSpecialRule)
        private repository: Repository<ArmyListUnitTroopSpecialRule>
    ) {}

    async create(armyListUnit: ArmyListUnit, rule: ArmyListUnitTroopSpecialRuleDTO): Promise<ArmyListUnitTroopSpecialRule> {
        const id: string = randomUUID();

        return this.repository.create({
            id,
            armyListUnit,
            troopId: rule.troopId,
            ruleId: rule.ruleId
        });
    }

    async save(equipment: ArmyListUnitTroopSpecialRule): Promise<ArmyListUnitTroopSpecialRule> {
        return this.repository.save(equipment);
    }
}
