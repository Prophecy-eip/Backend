import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Request,
    Body,
    BadRequestException, NotFoundException
} from "@nestjs/common";
import { GameService } from "@app/game/game.service";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { ArmyList } from "@army-list/army-list.entity";
import { ArmyListService } from "@army-list/army-list.service";
import { ProfileService } from "@profile/profile.service";

/**
 * @class GameController
 * @brief Controller that defines the games routes
 */
@Controller("games")
export class GameController {
    constructor(
        private readonly gameService: GameService,
        private readonly armyListService: ArmyListService,
        private readonly profileService: ProfileService
    ) {}

    /**
     * @brief Creates a new game
     * @param req The request
     * @param opponent The opponent's username
     * @param ownerScore The user's score
     * @param opponentScore The opponent's score
     * @param ownerArmyListId The user's army list id
     * @param opponentArmyListId The opponent's army list id
     */
    @UseGuards(JwtAuthGuard)
    @Post("")
    @HttpCode(HttpStatus.CREATED)
    async create(@Request() req,
        @Body("opponent") opponent: string | null,
        @Body("ownerScore") ownerScore: number,
        @Body("opponentScore") opponentScore: number,
        @Body("ownerArmyListId") ownerArmyListId: string | null,
        @Body("opponentArmyListId") opponentArmyListId: string | null,
        ): Promise<void> {
        const username = req.user.username;
        const ownerArmyList: ArmyList = await this.armyListService.findOneById(ownerArmyListId);
        const opponentArmyList: ArmyList = await this.armyListService.findOneById(opponentArmyListId);

        if (opponent === undefined || ownerScore === undefined || opponentScore === undefined ||
            ownerArmyList === undefined || opponentArmyList === undefined) {
            throw new BadRequestException();
        }
        if (opponent !== null && await this.profileService.findOneByUsername(opponent) === null) {
            throw new NotFoundException(`User ${opponent} not found.`);
        }
        if (ownerArmyList === null || opponentArmyList === null) {
            throw new NotFoundException(`Army list ${ownerArmyList === null ? 
                ownerArmyListId : opponentArmyListId} not found.`);
        }
        if ((ownerScore + opponentScore) !== 20) {
            throw new BadRequestException(`The sum of both scores must be equal to 20 (here ${ownerScore + opponentScore}).`);
        }

        await this.gameService.create(username, opponent, ownerScore, opponentScore, ownerArmyListId, opponentArmyListId);
    }
}
