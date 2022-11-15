import { Injectable} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";

import { ArmyList } from "./army-list.entity";

@Injectable()
export class ArmyListService {
    constructor(
        @InjectRepository(ArmyList)
        private repository: Repository<ArmyList>
    ) {}

    async create(name: string,
                 army: string,
                 cost: string,
                 isShared: boolean,
                 owner: string): Promise<ArmyList> {
        const id: string = randomUUID();
        return this.repository.create({ id, name, army, cost, isShared, owner });
    }

    save(list: ArmyList): Promise<ArmyList> {
        return this.repository.save(list);
    }
}
