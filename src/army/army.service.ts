import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Army } from "./army.entity";
import { Repository } from "typeorm";
import { UnitService } from "@army/unit/unit.service";
import { Unit } from "@army/unit/unit.entity";

export type ArmyServiceServiceOptions = {
    loadUnits?: boolean;
}

@Injectable()
export class ArmyService {
    constructor(
        @InjectRepository(Army)
        private repository: Repository<Army>,
        private unitService: UnitService
    ) {}

    async getAll(): Promise<Army[]> {
        let query = this.repository
            .createQueryBuilder("armies")
            .select("armies");

        return query.getMany();
    }

    async findOneById(id: number, options?: ArmyServiceServiceOptions): Promise<Army> {
        let army: Army = await this.repository.findOneBy([{ id: id }]);

        if (options?.loadUnits === true) {
            army = await this._loadUnits(army);
        }
        return army;
    }

    private async _loadUnits(army: Army): Promise<Army> {
        if (army !== null && army !== undefined) {
            army.units = await Promise.all(army.unitIds.map(
                async (id: number): Promise<Unit> => this.unitService.findOneById(id)));
        }
        return army;
    }
}
