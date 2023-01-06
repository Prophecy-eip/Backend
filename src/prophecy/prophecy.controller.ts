import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Request } from "@nestjs/common";
import * as dotenv from "dotenv";

import { JwtAuthGuard } from "../account/auth/guards/jwt-auth.guard";
import { ProphecyUnitMathsRequestDTO, ProphecyUnitMathsResponseDTO } from "./unit/prophecy-unit-maths.dto";
import { ArmyListUnit } from "../army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitService } from "../army-list/army-list-unit/army-list-unit.service";
import { ArmyListUnitCredentialsDTO } from "../army-list/army-list-unit/army-list-unit-credentials.dto";
import { ProphecyUnit } from "./unit/prophecy-unit.entity";
import { ProphecyUnitService } from "./unit/prophecy-unit.service";
import { ProphecyUnitDTO } from "./unit/prophecy-unit.dto";

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
    @Post("units/get-prophecy")
    @HttpCode(HttpStatus.OK)
    async getUnitsProphecy(@Request() req,
        @Body("attackingRegiment") attackingRegiment: ArmyListUnitCredentialsDTO,
        @Body("defendingRegiment") defendingRegiment: ArmyListUnitCredentialsDTO) {
        const attackingRegimentUnit: ArmyListUnit = await this.armyListUnitService.create(attackingRegiment.unitId, attackingRegiment.quantity, attackingRegiment.formation, null, attackingRegiment.troopIds);
        const defendingRegimentUnit: ArmyListUnit = await this.armyListUnitService.create(defendingRegiment.unitId, defendingRegiment.quantity, defendingRegiment.formation, null, defendingRegiment.troopIds);

        await attackingRegimentUnit.load();
        await defendingRegimentUnit.load();
        await this.armyListUnitService.save(attackingRegimentUnit);
        await this.armyListUnitService.save(defendingRegimentUnit);
        if (attackingRegimentUnit.troopIds.length != 1 || defendingRegimentUnit.troopIds.length != 1) {
            throw new BadRequestException("The troopIds must contain one (and only one) id");
        }
        let request: ProphecyUnitMathsRequestDTO = new ProphecyUnitMathsRequestDTO(MATHS_KEY, attackingRegimentUnit, defendingRegimentUnit);
        const content: string = JSON.stringify(request);

        const response: Response = await fetch(MATHS_UNITS_REQUEST_URL, {
            method: "POST",
            body: content,
            headers: { "Content-Type": "application/json" }
        });
        if (response.status === HttpStatus.BAD_REQUEST) {
            console.log(response);
            throw new BadRequestException();
        }
        const mathsResponse: ProphecyUnitMathsResponseDTO = (await response.json()) as ProphecyUnitMathsResponseDTO;
        const prophecy: ProphecyUnit = await this.prophecyUnitService.create(req.user.username, attackingRegimentUnit.id,
            defendingRegimentUnit.id, mathsResponse);
        await prophecy.load();
        await this.prophecyUnitService.save(prophecy);
        return new ProphecyUnitDTO(prophecy);
    }
}
