import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitMagicStandard } from "./army-list-unit-magic-standard.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";

@Injectable()
export class ArmyListUnitMagicStandardService {
    constructor(
        @InjectRepository(ArmyListUnitMagicStandard)
        private repository: Repository<ArmyListUnitMagicStandard>
    ) {}

    async create(armyListUnit: ArmyListUnit, magicStandardId: number, unitOptionId: number, quantity: number,
        valuePoints: number): Promise<ArmyListUnitMagicStandard> {
        const id: string = randomUUID();

        return this.repository.create({ id, armyListUnit, magicStandardId, unitOptionId, quantity, valuePoints });
    }

    async save(standard: ArmyListUnitMagicStandard): Promise<ArmyListUnitMagicStandard> {
        return this.repository.save(standard);
    }
}
