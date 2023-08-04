import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitMagicItem } from "./army-list-unit-magic-item.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitMagicItemDTO } from "@army-list/army-list-unit/magic-item/army-list-unit-magic-item.dto";

@Injectable()
export class ArmyListUnitMagicItemService {
    constructor(
        @InjectRepository(ArmyListUnitMagicItem)
        private repository: Repository<ArmyListUnitMagicItem>
    ) {}

    async create(armyListUnit: ArmyListUnit, item: ArmyListUnitMagicItemDTO): Promise<ArmyListUnitMagicItem> {
        const id: string = randomUUID();
        return this.repository.create({
            id,
            armyListUnit: armyListUnit,
            unitId: item.unitId,
            magicItemId: item.magicItemId,
            unitOptionId: item.unitOptionId,
            equipmentId: item.equipmentId,
            quantity: item.quantity,
            valuePoints: item.valuePoints
        });
    }

    async save(upgrade: ArmyListUnitMagicItem): Promise<ArmyListUnitMagicItem> {
        return this.repository.save(upgrade);
    }
}
