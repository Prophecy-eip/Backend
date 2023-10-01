import {
    Controller,
    HttpCode,
    HttpStatus,
    Body,
    Post,
    Get,
    Put,
    Request,
    UseGuards,
    BadRequestException,
    NotFoundException, Param, Delete, UnauthorizedException, ForbiddenException
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";

import { JwtAuthGuard } from "@account/auth/guards/jwt-auth.guard";
// import { ParamHelper } from "@helper/param.helper";
import { ArmyList } from "./army-list.entity";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";
import { ArmyListUnitCredentialsDTO } from "./army-list-unit/army-list-unit-credentials.dto";
import { ArmyListDTO, ArmyListParameterDTO } from "./army-list.dto";
import { ArmyListCredentialsDTO } from "./army-list-credentials.dto";

import { ArmyListUnitService } from "./army-list-unit/army-list-unit.service";
import { ArmyListService } from "./army-list.service";
import { ArmyService } from "@army/army.service";
import { Army } from "@army/army.entity";
import { ParamHelper } from "@helper/param.helper";

type Id = {
    id: string;
}

@Controller("armies-lists")
export class ArmyListController {
    constructor(
        private readonly armyListService: ArmyListService,
        private readonly armyListUnitService: ArmyListUnitService,
        private readonly armyService: ArmyService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post("")
    @HttpCode(HttpStatus.CREATED)
    async create(@Request() req, @Body() param: ArmyListParameterDTO): Promise<Id> {
        if (!ParamHelper.isValid(param)) {
            throw new BadRequestException("army list must not be null or undefined");
        }
        const army: Army = await this.armyService.findOneById(param.armyId);
        if (army === null) {
            throw new NotFoundException(`The army ${param.armyId} does not exist.`);
        }
        const list: ArmyList = await this.armyListService.create(param.name, req.user.username, param.armyId, param.valuePoints, param.isShared,
            param.isFavorite, []);

        try {
            await this.armyListService.save(list);
            list.units = await Promise.all(param.units.map(async (unit: ArmyListUnitCredentialsDTO): Promise<ArmyListUnit> =>
                this.armyListUnitService.createAndSaveWithRelations(unit, list)));
            return { id: list.id };
        } catch (error) {
            console.error(error);
            if (error instanceof QueryFailedError) {
                throw new NotFoundException(`The army ${list.armyId} was not found`);
            }
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("")
    @HttpCode(HttpStatus.OK)
    async lookup(@Request() req): Promise<ArmyListCredentialsDTO[]> {
        const lists: ArmyList[] = await this.armyListService.findByOwner(req.user.username);
        let credentials: ArmyListCredentialsDTO[] = [];

        for (const list of lists) {
            credentials.push(new ArmyListCredentialsDTO(list));
        }
        return credentials;
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async get(@Request() req, @Param("id") id: string): Promise<ArmyListDTO> {
        let list: ArmyList = await this.armyListService.findOneById(id, { loadAll: true });

        if (list === null) {
            throw new NotFoundException();
        }
        if (list.owner !== req.user.username && !list.isShared) {
            throw new UnauthorizedException();
        }
        return new ArmyListDTO(list);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("/:id")
    @HttpCode(HttpStatus.OK)
    async delete(@Request() req, @Param("id") id: string): Promise<void> {
        let list: ArmyList = await this.armyListService.findOneById(id);

        if (list === null) {
            throw new NotFoundException();
        }
        if (list.owner !== req.user.username) {
            throw new ForbiddenException();
        }
        await this.armyListService.delete(list.id);
    }

    @UseGuards(JwtAuthGuard)
    @Put("/:id")
    @HttpCode(HttpStatus.OK)
    async update(@Request() req,
        @Param("id") id: string,
        @Body() param: ArmyListParameterDTO): Promise<void> {
        if (!ParamHelper.isValid(param)) {
            throw new BadRequestException("army list must not be null or undefined");
        }
        let list: ArmyList = await this.armyListService.findOneById(id, { loadUnits: true});

        if (list === null) {
            throw new NotFoundException();
        }
        if (list.owner !== req.user.username) {
            throw new ForbiddenException();
        }
        await this.armyListUnitService.deleteByArmyList(list.id);

        const armyListUnits: ArmyListUnit[] = await Promise.all(param.units.map(async (unit: ArmyListUnitCredentialsDTO): Promise<ArmyListUnit> =>
            this.armyListUnitService.createAndSaveWithRelations(unit, list)));

        await this.armyListService.update(id, param.name, param.armyId, param.valuePoints, param.isShared, param.isFavorite, armyListUnits);
    }
}
