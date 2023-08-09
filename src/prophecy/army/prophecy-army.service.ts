import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ProphecyArmy } from "@prophecy/army/prophecy-army.entity";
import { ArmyList } from "@army-list/army-list.entity";
import { ArmyListService } from "@army-list/army-list.service";

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
        armyList1: ArmyList,
        armyList2: ArmyList,
        player1Score: number,
        player2Score: number
    ): Promise<ProphecyArmy> {
        const id: string = randomUUID();

        return this.repository.create({
            id,
            owner,
            armyList1,
            armyList2,
            player1Score: player1Score,
            player2Score: player2Score
        });
    }

    public async save(prophecy: ProphecyArmy): Promise<ProphecyArmy> {
        return this.repository.save(prophecy);
    }

    public async findByOwner(owner: string): Promise<ProphecyArmy[]> {
        return this.repository.find({
            where: { owner: owner },
            relations: {
                armyList1: true,
                armyList2: true
            }
        });
    }
}

export default ProphecyArmyService;
