import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitMagicItem } from "./army-list-unit-magic-item.entity";

@Injectable()
export class ArmyListUnitUpgradeService {
    constructor(
        @InjectRepository(ArmyListUnitMagicItem)
        private repository: Repository<ArmyListUnitMagicItem>
    ) {}

    async create(armyListUnitId: string, unitId: number, magicItemId: number, unitOptionId: number, equipmentId: number, quantity: number, valuePoints: number): Promise<ArmyListUnitMagicItem> {
        const id: string = randomUUID();
        return this.repository.create({ id, armyListUnitId, unitId, magicItemId, unitOptionId, equipmentId, quantity, valuePoints});
    }

    async save(upgrade: ArmyListUnitMagicItem): Promise<ArmyListUnitMagicItem> {
        return this.repository.save(upgrade);
    }
}
