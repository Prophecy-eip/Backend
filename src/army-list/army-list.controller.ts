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
import { ParamHelper } from "@helper/param.helper";
import { ArmyList } from "./army-list.entity";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";
import {
    ArmyListUnitTroopSpecialRule
} from "./army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.entity";
import { ArmyListUnitTroopEquipment } from "./army-list-unit/troop/equipment/army-list-unit-troop-equipment.entity";
import { ArmyListUnitMagicItem } from "./army-list-unit/magic-item/army-list-unit-magic-item.entity";
import { ArmyListUnitMagicStandard } from "./army-list-unit/magic-standard/army-list-unit-magic-standard.entity";
import { ArmyListUnitOption } from "./army-list-unit/option/army-list-unit-option.entity";
import { ArmyListUnitCredentialsDTO } from "./army-list-unit/army-list-unit-credentials.dto";
import { ArmyListDTO } from "./army-list.dto";
import { ArmyListCredentialsDTO } from "./army-list-credentials.dto";

import { ArmyListUnitService } from "./army-list-unit/army-list-unit.service";
import { ArmyListService } from "./army-list.service";
import { ArmyListUnitMagicItemService } from "./army-list-unit/magic-item/army-list-unit-magic-item.service";
import {
    ArmyListUnitMagicStandardService
} from "./army-list-unit/magic-standard/army-list-unit-magic-standard.service";
import { ArmyListUnitOptionService } from "./army-list-unit/option/army-list-unit-option.service";
import {
    ArmyListUnitTroopEquipmentService
} from "./army-list-unit/troop/equipment/army-list-unit-troop-equipment.service";
import {
    ArmyListUnitTroopSpecialRuleService
} from "./army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.service";
import { ArmyService } from "@army/army.service";
import { Army } from "@army/army.entity";
import { UnitService } from "@army/unit/unit.service";

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
        private readonly armyService: ArmyService,
        private readonly unitService: UnitService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post("")
    @HttpCode(HttpStatus.CREATED)
    async create(@Request() req,
        @Body("name") name: string,
        @Body("armyId") armyId: number,
        @Body("valuePoints") valuePoints: number,
        @Body("units") units: ArmyListUnitCredentialsDTO[],
        @Body("isShared") isShared: boolean,
        @Body("isFavorite") isFavorite: boolean) {
        if (!ParamHelper.isValid(name) || !ParamHelper.isValid(armyId) || !ParamHelper.isValid(valuePoints) ||
            !ParamHelper.isValid(units) || !ParamHelper.isValid(isFavorite)) {
            throw new BadRequestException();
        }
        const army: Army = await this.armyService.findOneById(armyId);
        if (army === null) {
            throw new NotFoundException(`The army ${armyId} does not exist.`);
        }
        const list: ArmyList = await this.armyListService.create(name, req.user.username, armyId, valuePoints, isShared,
            isFavorite, []);

        try {
            await this.armyListService.save(list);
            list.units = await this.saveUnits(list.id, units, list);
        } catch (error) {
            console.error(error);
            if (error instanceof QueryFailedError) {
                throw new NotFoundException(`The army ${list.armyId} was not found`);
            }

        }
        // await this.saveUnits(list.id, units);
    }

    @UseGuards(JwtAuthGuard)
    @Get("")
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
    @Put("/:id")
    @HttpCode(HttpStatus.OK)
    async update(@Request() req,
            @Param("id") id: string,
            @Body("name") name: string,
            @Body("armyId") armyId: number,
            @Body("valuePoints") valuePoints: number,
            @Body("units") units: ArmyListUnitCredentialsDTO[],
            @Body("isShared") isShared: boolean,
            @Body("isFavorite") isFavorite) {
            let list: ArmyList = await this.armyListService.findOneById(id, { loadUnits: true});

            if (list === null) {
                throw new NotFoundException();
            }
            if (list.owner !== req.user.username) {
                throw new ForbiddenException();
            }
            await this.armyListUnitService.deleteByArmyList(list.id);

            const armyListUnits: ArmyListUnit[] = await this.saveUnits(list.id, units, list);

            await this.armyListService.update(id, name, armyId, valuePoints, isShared, isFavorite, armyListUnits);
    }

    private async saveUnits(listId: string, units: ArmyListUnitCredentialsDTO[], armyList: ArmyList): Promise<ArmyListUnit[]> {
        let armyListUnits: ArmyListUnit[] = [];

        for (const unitCredential of units) {
            const u: ArmyListUnit = await this.armyListUnitService.create(unitCredential.unitId, unitCredential.quantity, unitCredential.formation,
                unitCredential.troopIds, [], armyList);
            await this.armyListUnitService.save(u);
            for (const item of unitCredential.magicItems) {
                const i: ArmyListUnitMagicItem = await this.armyListUnitMagicItemService.create(u, item.unitId,
                    item.magicItemId, item.unitOptionId, item.equipmentId, item.quantity, item.valuePoints);
                await this.armyListUnitMagicItemService.save(i);
                await this.armyListUnitService.addOption(u, i);
            }
            for (const standard of unitCredential.magicStandards) {
                const s: ArmyListUnitMagicStandard = await this.armyListUnitMagicStandardService.create(u,
                    standard.magicStandardId, standard.unitOptionId, standard.quantity, standard.valuePoints);
                await this.armyListUnitMagicStandardService.save(s);
                await this.armyListUnitService.addOption(u, s);
            }
            for (const option of unitCredential.options) {
                const o: ArmyListUnitOption = await this.armyListUnitOptionService.create(u, option.unitId,
                    option.optionId, option.quantity, option.valuePoints);
                await this.armyListUnitOptionService.save(o);
                await this.armyListUnitService.addOption(u, o);
            }
            for (const rule of unitCredential.specialRuleTroops) {
                const r: ArmyListUnitTroopSpecialRule = await this.armyListUnitTroopSpecialRuleService.create(u,
                    rule.troopId, rule.ruleId);
                await this.armyListUnitTroopSpecialRuleService.save(r);
                await this.armyListUnitService.addOption(u, r);
            }
            for (const equipment of unitCredential.equipmentTroops) {
                const e: ArmyListUnitTroopEquipment = await this.armyListUnitTroopEquipmentService.create(u,
                    equipment.troopId, equipment.equipmentId);
                await this.armyListUnitTroopEquipmentService.save(e);
                await this.armyListUnitService.addOption(u, e);
            }
            armyListUnits.push(u);
        }
        return armyListUnits;
    }
}
