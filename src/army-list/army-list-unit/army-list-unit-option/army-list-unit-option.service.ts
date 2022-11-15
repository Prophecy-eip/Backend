import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";

import { ArmyListUnitOption } from "./army-list-unit-option.entity";
import { Repository } from "typeorm";

@Injectable()
export class ArmyListUnitOptionService {
    constructor(
        @InjectRepository(ArmyListUnitOption)
        private repository: Repository<ArmyListUnitOption>
    ) {}

    async create(unit: string, option: string): Promise<ArmyListUnitOption> {
        const id: string = randomUUID();
        return this.repository.create({ id, unit, option });
    }

    async save(option: ArmyListUnitOption): Promise<ArmyListUnitOption> {
        return this.repository.save(option);
    }
}
