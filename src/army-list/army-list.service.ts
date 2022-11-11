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
                 units: ArmyListUnitDTO[],
                 upgrades: UpgradeDTO[],
                 rules: Rule[],
                 isShared?: boolean): Promise<ArmyList> {
        const shared: boolean = (isShared === undefined) ? false : isShared;
        const id: string = randomUUID();
        return this.repository.create();
    }
}
