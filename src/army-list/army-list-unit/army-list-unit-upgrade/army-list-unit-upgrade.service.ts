import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitUpgrade } from "./army-list-unit-upgrade.entity";

@Injectable()
export class ArmyListUnitUpgradeService {
    constructor(
        @InjectRepository(ArmyListUnitUpgrade)
        private repository: Repository<ArmyListUnitUpgrade>
    ) {}

    async create(unit: string, upgrade: string): Promise<ArmyListUnitUpgrade> {
        const id: string = randomUUID();
        return this.repository.create({ id, unit, upgrade });
    }

    async save(upgrade: ArmyListUnitUpgrade): Promise<ArmyListUnitUpgrade> {
        return this.repository.save(upgrade);
    }
}