import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArmyListUpgrade } from "./army-list-upgrade.entity";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

@Injectable()
export class ArmyListUpgradeService {
    constructor(
        @InjectRepository(ArmyListUpgrade)
        private repository: Repository<ArmyListUpgrade>
    ) {}

    async create(list: string, upgrade: string): Promise<ArmyListUpgrade> {
        const id: string = randomUUID();
        return this.repository.create({ id, list, upgrade });
    }

    async save(upgrade: ArmyListUpgrade): Promise<ArmyListUpgrade> {
        return this.repository.save(upgrade);
    }
}