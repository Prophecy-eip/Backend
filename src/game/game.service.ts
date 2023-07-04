import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "@app/game/game.entity";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private repository: Repository<Game>
    ) {}

    async create(
        ownerId: string,
        opponentId: string | null,
        ownerScore: number,
        opponentScore: number,
        ownerArmyListId: string | null,
        opponentArmyListId: string | null): Promise<Game> {
        const id: string = randomUUID();

        return this.repository.create({
            id,
            owner: ownerId,
            opponent: opponentId,
            ownerScore,
            opponentScore,
            ownerArmyList: ownerArmyListId,
            opponentArmyList: opponentArmyListId
        });
    }
}
