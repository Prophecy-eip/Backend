import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ProphecyArmy } from "@prophecy/army/prophecy-army.entity";
import { ArmyList } from "@army-list/army-list.entity";
import { ArmyListService } from "@army-list/army-list.service";
import { ProphecyArmyDTO } from "@prophecy/army/prophecy-army.dto";

export type ProphecyArmyServiceOptions = {
    loadAll?: boolean;
    loadArmyList1?: boolean;
    loadArmyList2?: boolean;
}

@Injectable()
class ProphecyArmyService {
    constructor(
        @InjectRepository(ProphecyArmy)
        private repository: Repository<ProphecyArmy>,
        private armyListService: ArmyListService
    ) {}

    public async create(
        owner: string,
        prophecy: ProphecyArmyDTO,
        options?: ProphecyArmyServiceOptions
    ): Promise<ProphecyArmy> {
        const id: string = randomUUID();
        const armyList1: ArmyList = await this.armyListService.findOneById(prophecy.armyList1,
            {loadAll: options?.loadAll === true || options?.loadArmyList1 === true });
        const armyList2: ArmyList = await this.armyListService.findOneById(prophecy.armyList2,
            {loadAll: options?.loadAll === true || options?.loadArmyList2 === true });

        if (armyList1 === null || armyList2 === null) {
            throw new NotFoundException(`Army list ${(armyList1 === null) ? prophecy.armyList1 : prophecy.armyList2} not found.`);
        }
        return this.repository.create({
            id,
            owner,
            armyList1,
            armyList2,
            player1Score: prophecy.player1Score,
            player2Score: prophecy.player2Score
        });
    }

    public async save(prophecy: ProphecyArmy): Promise<ProphecyArmy> {
        return this.repository.save(prophecy);
    }
}

export default ProphecyArmyService;
