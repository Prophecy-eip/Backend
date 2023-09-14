import { Game } from "@app/game/game.entity";

export class GameDTO {
    constructor(game: Game) {
        this.id = game.id;
        this.opponent = game.opponent;
        this.ownerScore = game.ownerScore;
        this.opponentScore = game.opponentScore;
        this.ownerArmyList = game.ownerArmyList;
        this.opponentArmyList = game.opponentArmyList;
    }

    public id: string;
    public opponent: string | null;
    public ownerScore: number;
    public opponentScore: number;
    public ownerArmyList: string | null;
    public opponentArmyList: string | null;
}
