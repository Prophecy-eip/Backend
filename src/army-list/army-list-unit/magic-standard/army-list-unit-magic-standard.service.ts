import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitMagicStandard } from "./army-list-unit-magic-standard.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import {
    ArmyListUnitMagicStandardDTO
} from "@army-list/army-list-unit/magic-standard/army-list-unit-magic-standard.dto";

@Injectable()
export class ArmyListUnitMagicStandardService {
    constructor(
        @InjectRepository(ArmyListUnitMagicStandard)
        private repository: Repository<ArmyListUnitMagicStandard>
    ) {}

    async create(armyListUnit: ArmyListUnit, standard: ArmyListUnitMagicStandardDTO): Promise<ArmyListUnitMagicStandard> {
        const id: string = randomUUID();

        return this.repository.create({
            id,
            armyListUnit,
            magicStandardId: standard.magicStandardId,
            unitOptionId: standard.unitOptionId,
            quantity: standard.quantity,
            valuePoints: standard.valuePoints
        });
    }

    async save(standard: ArmyListUnitMagicStandard): Promise<ArmyListUnitMagicStandard> {
        return this.repository.save(standard);
    }
}
