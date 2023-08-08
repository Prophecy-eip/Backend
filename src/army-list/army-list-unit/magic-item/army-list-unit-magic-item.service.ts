import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitMagicItem } from "./army-list-unit-magic-item.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitMagicItemDTO } from "@army-list/army-list-unit/magic-item/army-list-unit-magic-item.dto";
import MagicItemService from "@army/magic-item/magic-item.service";
import UnitOptionService from "@army/unit/option/unit-option.service";
import EquipmentService from "@army/equipment/equipment.service";

@Injectable()
export class ArmyListUnitMagicItemService {
    constructor(
        @InjectRepository(ArmyListUnitMagicItem)
        private repository: Repository<ArmyListUnitMagicItem>,
        private magicItemService: MagicItemService,
        private unitOptionService: UnitOptionService,
        private equipmentService: EquipmentService
    ) {}

    async create(armyListUnit: ArmyListUnit, item: ArmyListUnitMagicItemDTO): Promise<ArmyListUnitMagicItem> {
        const id: string = randomUUID();

        return this.repository.create({
            id,
            armyListUnit: armyListUnit,
            unitId: item.unitId,
            magicItem: await this.magicItemService.findOneById(item.magicItemId),
            unitOption: (item.unitOptionId !== null) ? await this.unitOptionService.findOneById(item.unitOptionId) : null,
            equipment: (item.equipmentId !== null) ? await this.equipmentService.findOneById(item.equipmentId) : null,
            quantity: item.quantity,
            valuePoints: item.valuePoints
        });
    }

    async save(upgrade: ArmyListUnitMagicItem): Promise<ArmyListUnitMagicItem> {
        return this.repository.save(upgrade);
    }
}
