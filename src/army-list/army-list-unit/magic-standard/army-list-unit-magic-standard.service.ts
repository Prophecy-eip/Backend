import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitMagicStandard } from "./army-list-unit-magic-standard.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import {
    ArmyListUnitMagicStandardDTO
} from "@army-list/army-list-unit/magic-standard/army-list-unit-magic-standard.dto";
import MagicStandardService from "@army/magic-standard/magic-standard.service";
import UnitOptionService from "@army/unit/option/unit-option.service";
import { MagicStandard } from "@army/magic-standard/magic-standard.entity";

@Injectable()
export class ArmyListUnitMagicStandardService {
    constructor(
        @InjectRepository(ArmyListUnitMagicStandard)
        private repository: Repository<ArmyListUnitMagicStandard>,
        private magicStandardService: MagicStandardService,
        private unitOptionService: UnitOptionService
    ) {}

    async create(armyListUnit: ArmyListUnit, standard: ArmyListUnitMagicStandardDTO): Promise<ArmyListUnitMagicStandard> {
        const id: string = randomUUID();

            return this.repository.create({
            id,
            armyListUnit,
            magicStandard: await this.magicStandardService.findOneById(standard.magicStandardId),
            unitOption: await this.unitOptionService.findOneById(standard.unitOptionId),
            quantity: standard.quantity,
            valuePoints: standard.valuePoints
        });
    }

    async save(standard: ArmyListUnitMagicStandard): Promise<ArmyListUnitMagicStandard> {
        return this.repository.save(standard);
    }
}
