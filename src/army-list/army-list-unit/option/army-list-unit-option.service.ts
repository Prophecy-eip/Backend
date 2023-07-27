import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitOption } from "./army-list-unit-option.entity";
import { Repository } from "typeorm";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";

@Injectable()
export class ArmyListUnitOptionService {
    constructor(
        @InjectRepository(ArmyListUnitOption)
        private repository: Repository<ArmyListUnitOption>
    ) {}

    async create(armyListUnit: ArmyListUnit, unitId: number, optionId: number, quantity: number, valuePoints: number): Promise<ArmyListUnitOption> {
        const id: string = randomUUID();

        return this.repository.create({ id, armyListUnit, unitId, optionId, quantity, valuePoints });
    }
    async save(option: ArmyListUnitOption): Promise<ArmyListUnitOption> {
        return this.repository.save(option);
    }
}
