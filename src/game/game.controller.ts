import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Request,
    Body,
    BadRequestException, NotFoundException, Get, Delete, Param, ForbiddenException
} from "@nestjs/common";
import { GameService } from "@app/game/game.service";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { ArmyList } from "@army-list/army-list.entity";
import { ArmyListService } from "@army-list/army-list.service";
import { ProfileService } from "@profile/profile.service";
import { Game } from "@app/game/game.entity";
import { GameDTO, GameParameterDTO } from "@app/game/game.dto";
import { ParamHelper } from "@helper/param.helper";
import EntityId from "@common/types/enity-id.type";

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
     * @param ownerArmyList The user's army list id
     * @param opponentArmyListId The opponent's army list id
     */
    @UseGuards(JwtAuthGuard)
    @Post("")
    @HttpCode(HttpStatus.CREATED)
    async create(@Request() req,
        @Body() { opponent, ownerScore, opponentScore, ownerArmyListId, opponentArmyListId }: GameParameterDTO
        ): Promise<EntityId> {
        const username = req.user.username;
        const ownerArmyList: ArmyList = await this.armyListService.findOneById(ownerArmyListId);
        const opponentArmyList: ArmyList = await this.armyListService.findOneById(opponentArmyListId);

        if ((ownerScore + opponentScore) !== 20) {
            throw new BadRequestException(`The sum of both scores must be equal to 20 (here ${ownerScore +
            opponentScore}).`);
        }
        if (ParamHelper.isValid(opponent) && await this.profileService.findOneByUsername(opponent) === null) {
            throw new NotFoundException(`User ${opponent} not found.`);
        }
        if (ownerArmyList === null || opponentArmyList === null) {
            throw new NotFoundException(`Army list ${ownerArmyList === null ? ownerArmyListId : 
                opponentArmyListId} not found.`);
        }
        const game: Game = await this.gameService.create(username, opponent, ownerScore, opponentScore, ownerArmyListId,
            opponentArmyListId);
        await this.gameService.save(game);
        return { id: game.id };
    }

    @UseGuards(JwtAuthGuard)
    @Get("")
    @HttpCode(HttpStatus.OK)
    async lookup(@Request() req): Promise<GameDTO[]> {
        const username = req.user.username;
        const games: Game[] = await this.gameService.findByOwner(username);

        return games.map((g: Game): GameDTO => new GameDTO(g));
    }

    @UseGuards(JwtAuthGuard)
    @Delete("/:id")
    @HttpCode(HttpStatus.OK)
    async delete(@Request() req, @Param("id") id: string): Promise<void> {
        const username = req.user.username;
        const game: Game = await this.gameService.findOneById(id);

        if (game === null) {
            throw new NotFoundException(`Game ${id} not found.`);
        }
        if (game.owner !== username) {
            throw new ForbiddenException();
        }
        await this.gameService.delete(id);
    }
}
