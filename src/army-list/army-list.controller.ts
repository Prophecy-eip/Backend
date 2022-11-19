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
    NotFoundException, Param, Delete
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";

import { JwtAuthGuard } from "../account/auth/guards/jwt-auth.guard";
import { ArmyListUnitDTO } from "./army-list-unit/army-list-unit.dto";
import { ParamHelper } from "../helper/param.helper";
import { ArmyService } from "../army/army.service";
import { ArmyList } from "./army-list.entity";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";
import { ArmyListRule } from "./army-list-rule/army-list-rule.entity";
import { ArmyListUpgrade } from "./army-list-upgrade/army-list-upgrade.entity";

import { RuleService } from "../army/rule/rule.service";
import { UpgradeService } from "../army/upgrade/upgrade.service";import { UnitService } from "../army/unit/unit.service";
import { ArmyListUnitService } from "./army-list-unit/army-list-unit.service";
import { ArmyListRuleService } from "./army-list-rule/army-list-rule.service";import { ArmyListUpgradeService } from "./army-list-upgrade/army-list-upgrade.service";
import { ArmyListUnitUpgradeService } from "./army-list-unit/army-list-unit-upgrade/army-list-unit-upgrade.service";
import { ArmyListUnitOptionService } from "./army-list-unit/army-list-unit-option/army-list-unit-option.service";
import { ArmyListUnitOption } from "./army-list-unit/army-list-unit-option/army-list-unit-option.entity";
import { ArmyListUnitUpgrade } from "./army-list-unit/army-list-unit-upgrade/army-list-unit-upgrade.entity";
import { ArmyListService } from "./army-list.service";
import { ArmyListCredentialsDTO } from "./army-list-upgrade/army-list-credentials.dto";
import { ArmyListDTO } from "./army-list.dto";

@Controller("armies-lists")
export class ArmyListController {
    constructor(
        private readonly armyListService: ArmyListService,
        private readonly armyService: ArmyService,
        private readonly ruleService: RuleService,
        private readonly upgradeService: UpgradeService,
        private readonly unitService: UnitService,
        private readonly armyListUnitService: ArmyListUnitService,
        private readonly armyListRuleService: ArmyListRuleService,
        private readonly armyListUpgradeService: ArmyListUpgradeService,
        private readonly armyListUnitUpgradeService: ArmyListUnitUpgradeService,
        private readonly armyListUnitOptionService: ArmyListUnitOptionService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post("create")
    @HttpCode(HttpStatus.CREATED)
    async create(@Request() req,
        @Body("name") name: string,
        @Body("army") armyId: string,
        @Body("cost") cost: string,
        @Body("units") units: ArmyListUnitDTO[],
        @Body("upgrades") upgradesIds: string[],
        @Body("rules") rulesIds: string[],
        @Body("isShared") isShared?: boolean) {
        if (!ParamHelper.isValid(name) || !ParamHelper.isValid(armyId) || !ParamHelper.isValid(cost) ||
            !ParamHelper.isValid(units) || !ParamHelper.isValid(upgradesIds) || !ParamHelper.isValid(rulesIds)) {
            throw new BadRequestException();
        }
        const list: ArmyList = await this.armyListService.create(name, armyId, cost, isShared, req.user.username);
        try {
            await this.armyListService.save(list);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new NotFoundException(`The army ${list.army} was not found`);
            }
        }
        await this.saveListComponents(list, units, rulesIds, rulesIds);
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
        let list: ArmyList = await this.armyListService.findByOwnerAndId(req.user.username, id);

        if (list === null) {
            throw new NotFoundException();
        }
        await list.load();
        let units: ArmyListUnit[] = await this.armyListUnitService.findByArmyList(list.id);
        return new ArmyListDTO(list, units);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("/delete/:id")
    @HttpCode(HttpStatus.OK)
    async delete(@Request() req, @Param("id") id: string) {
        let list: ArmyList = await this.armyListService.findByOwnerAndId(req.user.username, id);

        if (list === null) {
            throw new NotFoundException();
        }
        await this.armyListService.delete(list.id);
    }

    @UseGuards(JwtAuthGuard)
    @Put("/update/:id")
    @HttpCode(HttpStatus.OK)
    async update(@Request() req, @Param("id") id: string,
        @Body("name") name: string,
        @Body("army") armyId: string,
        @Body("cost") cost: string,
        @Body("units") units: ArmyListUnitDTO[],
        @Body("upgrades") upgradesIds: string[],
        @Body("rules") rulesIds: string[],
        @Body("isShared") isShared?: boolean) {
            let list: ArmyList = await this.armyListService.findByOwnerAndId(req.user.username, id);

            if (list === null) {
                throw new NotFoundException();
            }
            await list.load();
            let oldUpgrades: string[] = list.upgrades;
            let oldRules: string[] = list.rules;
            await this.armyListUnitService.deleteByList(list.id)
            for (const upgrade in oldUpgrades) {
                await this.armyListUpgradeService.delete(upgrade);
            }
            for (const rule in oldRules) {
                await this.armyListRuleService.delete(rule);
            }
            try {
                await this.armyListService.update(list.id, name, armyId, cost, isShared);
            } catch (error) {
                throw new BadRequestException();
            }
            await this.saveListComponents(list, units, rulesIds, upgradesIds);
    }

    private async saveListComponents(list: ArmyList, units: ArmyListUnitDTO[], rulesIds: string[], upgradesIds: string[]) {
        for (const unit of units) {
            const u: ArmyListUnit = await this.armyListUnitService.create(unit.unitId, unit.number, unit.formation, list.id);
            await this.armyListUnitService.save(u);
            for (const option of unit.options) {
                const o: ArmyListUnitOption = await this.armyListUnitOptionService.create(u.id, option);
                try {
                    await this.armyListUnitOptionService.save(o);
                } catch (error) {
                    if (error instanceof QueryFailedError) {
                        throw new NotFoundException();
                    }
                }
            }
            for (const upgrade of unit.upgrades) {
                const up: ArmyListUnitUpgrade = await this.armyListUnitUpgradeService.create(u.id, upgrade);
                try {
                    await this.armyListUnitUpgradeService.save(up);
                } catch (error) {
                    if (error instanceof QueryFailedError) {
                        throw new NotFoundException();
                    }
                }
            }
            for (const rule of rulesIds) {
                const r: ArmyListRule = await this.armyListRuleService.create(list.id, rule);
                try {
                    await this.armyListRuleService.save(r);
                } catch (error) {
                    if (error instanceof QueryFailedError) {
                        throw new NotFoundException();
                    }
                }
            }
            for (const upgrade of upgradesIds) {
                const u: ArmyListUpgrade = await this.armyListUpgradeService.create(list.id, upgrade);
                try {
                    await this.armyListUpgradeService.save(u);
                } catch (error) {
                    if (error instanceof QueryFailedError) {
                        throw new NotFoundException();
                    }
                }
            }
        }
    }
}
