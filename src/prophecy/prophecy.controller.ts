import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Request,
    Get, Delete, NotFoundException, Param, ForbiddenException
} from "@nestjs/common";

import { JwtAuthGuard } from "@account/auth/guards/jwt-auth.guard";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitService } from "@army-list/army-list-unit/army-list-unit.service";
import { ProphecyUnit } from "./unit/prophecy-unit.entity";
import { ProphecyUnitService } from "./unit/prophecy-unit.service";
import { ProphecyUnitDTO, ProphecyUnitWithIdDTO } from "./unit/prophecy-unit.dto";
import ProphecyArmyService from "@prophecy/army/prophecy-army.service";
import ProphecyMathsService from "@prophecy/maths/prophecy-maths.service";
import { ArmyListService } from "@army-list/army-list.service";
import { ProphecyArmy } from "@prophecy/army/prophecy-army.entity";
import { ProphecyArmyMathResponseDTO } from "@prophecy/maths/prophecy-army-maths.dto";
import { ProphecyArmyWithIdDTO } from "@prophecy/army/prophecy-army.dto";
import { ArmyList } from "@army-list/army-list.entity";
import { ProphecyUnitMathsResponseDTO } from "@prophecy/maths/prophecy-unit-maths.dto";
import { ProphecyArmyRequestDTO, ProphecyUnitRequestDTO } from "@prophecy/prophecy.dto";

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
        @Body() param: ProphecyUnitRequestDTO): Promise<ProphecyUnitDTO> {
        try {
            const attackingRegimentUnit: ArmyListUnit = await this.armyListUnitService.createAndSaveWithRelations(param.attackingRegiment);
            const defendingRegimentUnit: ArmyListUnit = await this.armyListUnitService.createAndSaveWithRelations(param.defendingRegiment);
            const mathsResponse: ProphecyUnitMathsResponseDTO = await this.prophecyService.requestUnitsProphecy(
                attackingRegimentUnit, defendingRegimentUnit, param.attackingPosition);
            const prophecy: ProphecyUnit = await this.prophecyUnitService.create(req.user.username,
                attackingRegimentUnit, defendingRegimentUnit, param.attackingPosition, mathsResponse);

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
        @Body() {armyList1, armyList2}: ProphecyArmyRequestDTO,
    ): Promise<ProphecyArmyWithIdDTO> {
        const username: string = req.user.username;

        const armyList_1: ArmyList = await this.armyListService.findOneById(armyList1, { loadAll: true });
        const armyList_2: ArmyList = await this.armyListService.findOneById(armyList2, { loadAll: true });

        if (armyList_1 === null || armyList_2 === null) {
            throw new NotFoundException(`Army list ${(armyList_1 === null) ? armyList1 : armyList2} not found.`);
        }
        if (armyList_1.owner !== username && armyList_1.isShared === false) {
            throw new ForbiddenException(`Unauthorized to access army list ${armyList1}`);
        }
        if (armyList_2.owner !== username && armyList_2.isShared === false) {
            throw new ForbiddenException(`Unauthorized to access army list ${armyList2}`);
        }
        try {
            const prophecy: ProphecyArmy = await this.prophecyArmyService.create(username, armyList_1, armyList_2, 0, 0);
            const mathsResponse: ProphecyArmyMathResponseDTO = await this.prophecyService.requestArmiesProphecy(
                prophecy.armyList1.units, prophecy.armyList2.units);

            prophecy.player1Score = mathsResponse.first_player_score;
            prophecy.player2Score = mathsResponse.second_player_score;
            await this.prophecyArmyService.save(prophecy);
            return new ProphecyArmyWithIdDTO(prophecy);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            console.error(error);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("/armies")
    @HttpCode(HttpStatus.OK)
    async lookupArmiesProphecy(@Request() req): Promise<ProphecyArmyWithIdDTO[]> {
        const username: string = req.user.username;
        const prophecies: ProphecyArmy[] = await this.prophecyArmyService.findByOwner(username);

        return prophecies.map((p: ProphecyArmy): ProphecyArmyWithIdDTO => new ProphecyArmyWithIdDTO(p));
    }

    @UseGuards(JwtAuthGuard)
    @Delete("/armies/:id")
    @HttpCode(HttpStatus.OK)
    async deleteArmiesProphecy(@Request() req, @Param("id") id: string): Promise<void> {
        const username: string = req.user.username;
        const prophecy: ProphecyArmy = await this.prophecyArmyService.findOneById(id);

        if (prophecy === null) {
            throw new NotFoundException(`Prophecy ${id} not found`);
        }
        if (prophecy.owner !== username) {
            throw new ForbiddenException();
        }
        await this.prophecyArmyService.delete(id);
    }
}
