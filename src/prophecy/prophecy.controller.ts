import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Request,
    Get, Delete, NotFoundException, Param, ForbiddenException, InternalServerErrorException
} from "@nestjs/common";
import * as dotenv from "dotenv";

import { JwtAuthGuard } from "@account/auth/guards/jwt-auth.guard";
import { ProphecyUnitMathsRequestDTO, ProphecyUnitMathsResponseDTO } from "./unit/prophecy-unit-maths.dto";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitService } from "@army-list/army-list-unit/army-list-unit.service";
import { ArmyListUnitCredentialsDTO } from "@army-list/army-list-unit/army-list-unit-credentials.dto";
import { ProphecyUnit, ProphecyUnitAttackingPosition } from "./unit/prophecy-unit.entity";
import { ProphecyUnitService } from "./unit/prophecy-unit.service";
import { ProphecyUnitDTO, ProphecyUnitWithIdDTO } from "./unit/prophecy-unit.dto";
import { ParamHelper } from "@helper/param.helper";

dotenv.config();

const WEBSITE_URL = process.env.WEBSITE_URL;
const MATHS_UNITS_REQUEST_URL: string = `${WEBSITE_URL}/maths/units`;
const MATHS_KEY: string = process.env.MATHS_KEY;

@Controller("prophecies")
export class ProphecyController {
    constructor(
            private readonly armyListUnitService: ArmyListUnitService,
            private readonly prophecyUnitService: ProphecyUnitService,
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
            const attackingRegimentUnit: ArmyListUnit = await this.armyListUnitService.create(attackingRegiment.unitId,
                attackingRegiment.quantity, attackingRegiment.formation, attackingRegiment.troopIds, []); // TODO
            const defendingRegimentUnit: ArmyListUnit = await this.armyListUnitService.create(defendingRegiment.unitId,
                defendingRegiment.quantity, defendingRegiment.formation, defendingRegiment.troopIds, []); // TODO

            await attackingRegimentUnit.load();
            await defendingRegimentUnit.load();
            await this.armyListUnitService.save(attackingRegimentUnit);
            await this.armyListUnitService.save(defendingRegimentUnit);
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
            const prophecy: ProphecyUnit = await this.prophecyUnitService.create(req.user.username, attackingRegimentUnit.id,
                defendingRegimentUnit.id, attackingPosition, mathsResponse);
            await prophecy.load();
            await this.prophecyUnitService.save(prophecy);
            return new ProphecyUnitDTO(prophecy);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            if (error.message.includes("insert or update on table \"army_list_units\" violates foreign key constraint")) {
                throw new NotFoundException();
            }
            console.error(error);
            throw new InternalServerErrorException();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("units")
    @HttpCode(HttpStatus.OK)
    async lookupUnitsProphecy(@Request() req): Promise<ProphecyUnitWithIdDTO[]> {
        const prophecies: ProphecyUnit[] = await this.prophecyUnitService.findByOwner(req.user.username);
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

    private checkAttackingPosition(position: string): boolean {
        return (position === "front" || position === "back" || position === "flank");
    }
}
