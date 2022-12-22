import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { Upgrade } from "./upgrade.entity";

@Injectable()
export class UpgradeService {
    constructor(
        @InjectRepository(Upgrade)
        private repository: Repository<Upgrade>
    ) {}

    async findOneById(id: string) : Promise<Upgrade> {
        return this.repository.findOneBy([{ id: id }]);
    }

    async findByIds(ids: string[]) : Promise<Upgrade[]> {
        let array: Upgrade[] = [];

        for (const id of ids) {
            array.push(await this.repository.findOneBy([{ id: id }]));
        }
        return array;
    }
}
