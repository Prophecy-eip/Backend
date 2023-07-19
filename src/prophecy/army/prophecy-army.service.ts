import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

import { ProphecyArmy } from "@prophecy/army/prophecy-army.entity";

@Injectable()
class ProphecyArmyService {
    constructor(
        @InjectRepository(ProphecyArmy)
        private repository: Repository<ProphecyArmy>
    ) {}

    public async create(
        owner: string,
        armyList1,
        armyList2,
        player1Score,
        player2Score
    ): Promise<ProphecyArmy> {
        const id: string = randomUUID();

        return this.repository.create({
            id,
            owner,
            armyList1,
            armyList2,
            player1Score,
            player2Score
        });
    }

    public async save(prophecy: ProphecyArmy): Promise<ProphecyArmy> {
        return this.repository.save(prophecy);
    }
}

export default ProphecyArmyService;
