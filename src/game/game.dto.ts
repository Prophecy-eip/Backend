import { Game } from "@app/game/game.entity";
import { IsDefined, IsNumber, IsString, Max, Min } from "class-validator";

export class GameDTO  {
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

export class GameParameterDTO {

    @IsString()
    public opponent: string | null;

    @IsDefined()
    @IsNumber()
    @Min(0)
    @Max(20)
    public ownerScore: number;

    @IsDefined()
    @IsNumber()
    @Min(0)
    @Max(20)
    public opponentScore: number;

    @IsString()
    public ownerArmyListId: string | null;

    @IsString()
    public opponentArmyListId: string | null;
}
