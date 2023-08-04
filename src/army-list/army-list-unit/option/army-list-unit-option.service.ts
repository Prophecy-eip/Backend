import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitOption } from "./army-list-unit-option.entity";
import { Repository } from "typeorm";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitOptionDTO } from "@army-list/army-list-unit/option/army-list-unit-option.dto";

@Injectable()
export class ArmyListUnitOptionService {
    constructor(
        @InjectRepository(ArmyListUnitOption)
        private repository: Repository<ArmyListUnitOption>
    ) {}

    async create(armyListUnit: ArmyListUnit, option: ArmyListUnitOptionDTO): Promise<ArmyListUnitOption> {
        const id: string = randomUUID();

        return this.repository.create({
            id,
            armyListUnit,
            unitId: option.unitId,
            optionId: option.optionId,
            quantity: option.quantity,
            valuePoints: option.valuePoints
        });
    }

    async save(option: ArmyListUnitOption): Promise<ArmyListUnitOption> {
        return this.repository.save(option);
    }
}
