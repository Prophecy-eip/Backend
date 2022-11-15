import { Injectable} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ArmyList } from "./army-list.entity";
import {ArmyListUnit} from "./army-list-unit/army-list-unit.entity";
import {ArmyListUnitDTO} from "./army-list-unit/army-list-unit.dto";
import {UpgradeDTO} from "../army/upgrade/upgrade.dto";
import {Rule} from "../army/rule/rule.entity";
import {Army} from "../army/army.entity";
import {randomUUID} from "crypto";
import {Upgrade} from "../army/upgrade/upgrade.entity";

@Injectable()
export class ArmyListService {
    constructor(
        @InjectRepository(ArmyList)
        private repository: Repository<ArmyList>
    ) {}

    async create(user: string,
                 name: string,
                 army: Army,
                 cost: string,
                 isShared: boolean,
                 owner: string): Promise<ArmyList> {
        const id: string = randomUUID();
        const armyId = army.id;
        return this.repository.create({ id, name, army: army.id, cost, isShared, owner });
    }

    save(list: ArmyList): Promise<ArmyList> {
        return this.repository.save(list);
    }
}
