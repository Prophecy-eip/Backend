import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Unit } from "./unit.entity"

@Injectable()
export class UnitService {
    constructor(
        @InjectRepository(Unit)
        private repository: Repository<Unit>
    ) {}

    async findFromIds(ids: string[]): Promise<Unit[]> {
        let array: Unit[] = [];

        for (const id of ids) {
            const u: Unit = await this.repository.findOneBy([{ id: id }]);

            if (u === null)
                continue;
            array.push(u)
        }
        return array;
    }
}
