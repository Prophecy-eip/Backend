import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Request,
    Get, Delete, NotFoundException, Param, ForbiddenException
} from "@nestjs/common";
import * as dotenv from "dotenv";

import { JwtAuthGuard } from "@account/auth/guards/jwt-auth.guard";
import { ProphecyUnitMathsRequestDTO, ProphecyUnitMathsResponseDTO } from "./maths/prophecy-unit-maths.dto";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitService } from "@army-list/army-list-unit/army-list-unit.service";
import { ArmyListUnitCredentialsDTO } from "@army-list/army-list-unit/army-list-unit-credentials.dto";
import { ProphecyUnit, ProphecyUnitAttackingPosition } from "./unit/prophecy-unit.entity";
import { ProphecyUnitService } from "./unit/prophecy-unit.service";
import { ProphecyUnitDTO, ProphecyUnitWithIdDTO } from "./unit/prophecy-unit.dto";
import { ParamHelper } from "@helper/param.helper";
import ProphecyArmyService from "@prophecy/army/prophecy-army.service";
import ProphecyMathsService from "@prophecy/maths/prophecy-maths.service";
import { ArmyListService } from "@army-list/army-list.service";
import { ProphecyArmy } from "@prophecy/army/prophecy-army.entity";
import { ProphecyArmyMathResponseDTO } from "@prophecy/maths/prophecy-army-maths.dto";
import { ProphecyArmyWithIdDTO } from "@prophecy/army/prophecy-army.dto";

dotenv.config();

const WEBSITE_URL: string = process.env.WEBSITE_URL;
const MATHS_UNITS_REQUEST_URL: string = `${WEBSITE_URL}/maths/units`;
const MATHS_KEY: string = process.env.MATHS_KEY;

@Controller("prophecies")
export class ProphecyController {
    constructor(
            private readonly armyListUnitService: ArmyListUnitService,
            private readonly prophecyUnitService: ProphecyUnitService,
            private readonly prophecyArmyService: ProphecyArmyService,
            private readonly prophecyService: ProphecyMathsService,
            private readonly armyListService: ArmyListService
        ) {}

    @UseGuards(JwtAuthGuard)
    @Post("units")
    @HttpCode(HttpStatus.CREATED)
    async getUnitsProphecy(@Request() req,
        @Body("attackingRegiment") attackingRegiment: ArmyListUnitCredentialsDTO,
        @Body("defendingRegiment") defendingRegiment: ArmyListUnitCredentialsDTO,
        @Body("attackingPosition") attackingPosition: ProphecyUnitAttackingPosition): Promise<ProphecyUnitDTO> {
        if (!ParamHelper.isValid(attackingRegiment) || !ParamHelper.isValid(defendingRegiment)
            || !ParamHelper.isValid(attackingPosition) || !this.checkAttackingPosition(attackingPosition)) {
            throw new BadRequestException();
        }
        try {
            const attackingRegimentUnit: ArmyListUnit = await this.armyListUnitService.createAndSaveWithRelations(attackingRegiment);
            const defendingRegimentUnit: ArmyListUnit = await this.armyListUnitService.createAndSaveWithRelations(defendingRegiment);

            if (attackingRegimentUnit.troops.length > 1 || defendingRegimentUnit.troops.length > 1) {
                throw new BadRequestException("The troopIds must contain one troop max");
            }
            let request: ProphecyUnitMathsRequestDTO = new ProphecyUnitMathsRequestDTO(MATHS_KEY, attackingRegimentUnit,
                defendingRegimentUnit, attackingPosition);
            const content: string = JSON.stringify(request);
            const response: Response = await fetch(MATHS_UNITS_REQUEST_URL, {
                method: "POST",
                body: content,
                headers: {"Content-Type": "application/json"}
            });
            if (response.status === HttpStatus.BAD_REQUEST || response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
                console.error(response);
                throw new BadRequestException();
            }
            const mathsResponse: ProphecyUnitMathsResponseDTO = (await response.json()) as ProphecyUnitMathsResponseDTO;
            const prophecy: ProphecyUnit = await this.prophecyUnitService.create(req.user.username, attackingRegimentUnit,
                defendingRegimentUnit, attackingPosition, mathsResponse);
            await this.prophecyUnitService.save(prophecy);
            return new ProphecyUnitDTO(prophecy);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            if (error.message.includes("insert or update on table \"army_list_units\" violates foreign key constraint")) {
                throw new NotFoundException();
            }
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("units")
    @HttpCode(HttpStatus.OK)
    async lookupUnitsProphecy(@Request() req): Promise<ProphecyUnitWithIdDTO[]> {
        const prophecies: ProphecyUnit[] = await this.prophecyUnitService.findByOwner(req.user.username, { loadAll: true });
        let propheciesDto: ProphecyUnitWithIdDTO[] = [];

        for (const p of prophecies) {
            propheciesDto.push(new ProphecyUnitWithIdDTO(p));
        }
        return propheciesDto;
    }

    @UseGuards(JwtAuthGuard)
    @Delete("units/:id")
    @HttpCode(HttpStatus.OK)
    async deleteUnitsProphecy(
        @Request() req,
        @Param("id") id: string) : Promise<void> {
        if (!ParamHelper.isValid(id)) {
            throw new BadRequestException("An id is required");
        }
        const prophecy: ProphecyUnit = await this.prophecyUnitService.findOneById(id);

        if (prophecy === null) {
            throw new NotFoundException(`Prophecy ${id} does not exist.`);
        }
        if (prophecy.owner !== req.user.username) {
            throw new ForbiddenException();
        }
        await this.prophecyUnitService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/armies")
    @HttpCode(HttpStatus.CREATED)
    async getArmiesProphecy(
        @Request() req,
        @Body("armyList1") armyList1Id: string,
        @Body("armyList2") armyList2Id: string,
    ): Promise<ProphecyArmyWithIdDTO> {
        const username: string = req.user.username;

        try {
            const prophecy: ProphecyArmy = await this.prophecyArmyService.create(username, {
                armyList1: armyList1Id,
                armyList2: armyList2Id,
                player1Score: 0,
                player2Score: 0
            }, {loadAll: true});
            const mathsResponse: ProphecyArmyMathResponseDTO = await this.prophecyService.requestArmiesProphecy(
                prophecy.armyList1.units, prophecy.armyList2.units);

            console.log(mathsResponse)
            prophecy.player1Score = mathsResponse.first_player_score;
            prophecy.player2Score = mathsResponse.second_player_score;
            await this.prophecyArmyService.save(prophecy);
            return new ProphecyArmyWithIdDTO(prophecy);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    private checkAttackingPosition(position: string): boolean {
        return (position === "front" || position === "back" || position === "flank");
    }
}
