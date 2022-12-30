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

import { JwtAuthGuard } from "../account/auth/guards/jwt-auth.guard";
import { ArmyListUnitDTO } from "./army-list-unit/army-list-unit.dto";
import { ParamHelper } from "../helper/param.helper";
import { ArmyList } from "./army-list.entity";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";

import { ArmyListUnitService } from "./army-list-unit/army-list-unit.service";
import { ArmyListService } from "./army-list.service";
import { ArmyListDTO } from "./army-list.dto";
import { ArmyListCredentialsDTO } from "./army-list-credentials.dto";
import { ArmyListUnitMagicItemService } from "./army-list-unit/magic-item/army-list-unit-magic-item.service";
import {
    ArmyListUnitMagicStandardService
} from "./army-list-unit/magic-standard/army-list-unit-magic-standard.service";
import { ArmyListUnitOptionService } from "./army-list-unit/option/army-list-unit-option.service";
import {
    ArmyListUnitTroopEquipmentService
} from "./army-list-unit/troop/equipment/army-list-unit-troop-equipment.service";
import {
    ArmyListUnitTroopSpecialRule
} from "./army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.entity";
import {
    ArmyListUnitTroopSpecialRuleService
} from "./army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.service";
import { ArmyListUnitTroopEquipment } from "./army-list-unit/troop/equipment/army-list-unit-troop-equipment.entity";
import { ArmyListUnitMagicItem } from "./army-list-unit/magic-item/army-list-unit-magic-item.entity";
import { ArmyListUnitMagicStandard } from "./army-list-unit/magic-standard/army-list-unit-magic-standard.entity";
import { ArmyListUnitOption } from "./army-list-unit/option/army-list-unit-option.entity";
import { ArmyListUnitCredentialsDTO } from "./army-list-unit/army-list-unit-credentials.dto";

@Controller("armies-lists")
export class ArmyListController {
    constructor(
        private readonly armyListService: ArmyListService,
        private readonly armyListUnitService: ArmyListUnitService,
        private readonly armyListUnitMagicItemService: ArmyListUnitMagicItemService,
        private readonly armyListUnitMagicStandardService: ArmyListUnitMagicStandardService,
        private readonly armyListUnitOptionService: ArmyListUnitOptionService,
        private readonly armyListUnitTroopSpecialRuleService: ArmyListUnitTroopSpecialRuleService,
        private readonly armyListUnitTroopEquipmentService: ArmyListUnitTroopEquipmentService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post("create")
    @HttpCode(HttpStatus.CREATED)
    async create(@Request() req,
        @Body("name") name: string,
        @Body("armyId") armyId: number,
        @Body("valuePoints") valuePoints: number,
        @Body("units") units: ArmyListUnitCredentialsDTO[],
        @Body("isShared") isShared: boolean,
        @Body("isFavourite") isFavourite: boolean) {
        if (!ParamHelper.isValid(name) || !ParamHelper.isValid(armyId) || !ParamHelper.isValid(valuePoints) ||
            !ParamHelper.isValid(units)) {
            throw new BadRequestException();
        }
        const list: ArmyList = await this.armyListService.create(name, req.user.username, armyId, valuePoints, isShared,
            isFavourite)

        try {
            await this.armyListService.save(list);
        } catch (error) {
            console.error(error)
            if (error instanceof QueryFailedError) {
                throw new NotFoundException(`The army ${list.armyId} was not found`);
            }
        }
        await this.saveUnits(list.id, units);
    }

    @UseGuards(JwtAuthGuard)
    @Get("lookup")
    @HttpCode(HttpStatus.OK)
    async lookup(@Request() req) {
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
    async get(@Request() req, @Param("id") id: string) {
        let list: ArmyList = await this.armyListService.findOneById(id);

        if (list === null) {
            throw new NotFoundException();
        }
        if (list.owner !== req.user.username && !list.isShared) {
            throw new UnauthorizedException();
        }
        let units: ArmyListUnit[] = await this.armyListUnitService.findByArmyList(list.id);
        return new ArmyListDTO(list, units);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("/delete/:id")
    @HttpCode(HttpStatus.OK)
    async delete(@Request() req, @Param("id") id: string) {
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
    @Put("/update/:id")
    @HttpCode(HttpStatus.OK)
    async update(@Request() req,
            @Param("id") id: string,
            @Body("name") name: string,
            @Body("armyId") armyId: number,
            @Body("valuePoints") valuePoints: number,
            @Body("units") units: ArmyListUnitCredentialsDTO[],
            @Body("isShared") isShared: boolean,
            @Body("isFavourite") isFavourite) {
            let list: ArmyList = await this.armyListService.findOneById(id);

            if (list === null) {
                throw new NotFoundException();
            }
            if (list.owner !== req.user.username) {
                new ForbiddenException();
            }
            await this.armyListService.update(id, name, armyId, valuePoints, isShared, isFavourite);
            await this.armyListUnitService.deleteByList(list.id)
            await this.saveUnits(list.id, units);
    }

    private async saveUnits(listId: string, units: ArmyListUnitCredentialsDTO[]) {
        for (const unit of units) {
            const u: ArmyListUnit = await this.armyListUnitService.create(unit.unitId, unit.quantity, unit.formation,
                listId, unit.troopIds);
            await this.armyListUnitService.save(u);
            for (const item of unit.magicItems) {
                const i: ArmyListUnitMagicItem = await this.armyListUnitMagicItemService.create(u.id, item.unitId,
                    item.magicItemId, item.unitOptionId, item.equipmentId, item.quantity, item.valuePoints);
                await this.armyListUnitMagicItemService.save(i);
            }
            for (const standard of unit.magicStandards) {
                const s: ArmyListUnitMagicStandard = await this.armyListUnitMagicStandardService.create(u.id,
                    standard.magicStandardId, standard.unitOptionId, standard.quantity, standard.valuePoints);
                await this.armyListUnitMagicStandardService.save(s);
            }
            for (const option of unit.options) {
                const o: ArmyListUnitOption = await this.armyListUnitOptionService.create(u.id, option.unitId,
                    option.optionId, option.quantity, option.valuePoints);
                await this.armyListUnitOptionService.save(o);
            }
            for (const rule of unit.specialRuleTroops) {
                const r: ArmyListUnitTroopSpecialRule = await this.armyListUnitTroopSpecialRuleService.create(u.id,
                    rule.troopId, rule.ruleId);
                await this.armyListUnitTroopSpecialRuleService.save(r);
            }
            for (const equipment of unit.equipmentTroops) {
                const e: ArmyListUnitTroopEquipment = await this.armyListUnitTroopEquipmentService.create(u.id,
                    equipment.troopId, equipment.equipmentId);
                await this.armyListUnitTroopEquipmentService.save(e);
            }
        }
    }
}
