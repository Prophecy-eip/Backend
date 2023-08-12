import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "@app/game/game.entity";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

/**
 * @class GameService
 * @brief Service that groups functions for games management in the database
 */
@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private repository: Repository<Game>
    ) {}

    /**
     * @brief Creates a new Game object
     * @param ownerId The owner's username
     * @param opponentId The opponent's username
     * @param ownerScore The owner's score
     * @param opponentScore The opponent's score
     * @param ownerArmyListId The owner's army list's id
     * @param opponentArmyListId The opponent's army list's id
     */
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
