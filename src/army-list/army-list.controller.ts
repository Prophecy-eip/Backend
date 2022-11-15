import {Controller, HttpCode, HttpStatus, Body, Post, Request, UseGuards, BadRequestException} from "@nestjs/common";

import { ArmyListService } from "./army-list.service";
import { JwtAuthGuard } from "../account/auth/guards/jwt-auth.guard";
import { ArmyListUnitDTO } from "./army-list-unit/army-list-unit.dto";
import { ParamHelper } from "../helper/param.helper";
import { ArmyService } from "../army/army.service";
import { Army } from "../army/army.entity";
import { ArmyList } from "./army-list.entity";
import { Upgrade } from "../army/upgrade/upgrade.entity";
import { Rule } from "../army/rule/rule.entity";
import { RuleService } from "../army/rule/rule.service";
import { UpgradeService } from "../army/upgrade/upgrade.service";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";
import { UnitService } from "../army/unit/unit.service";
import { ArmyListUnitService } from "./army-list-unit/army-list-unit.service";
import { ArmyListRuleService } from "./army-list-rule/army-list-rule.service";
import { ArmyListRule } from "./army-list-rule/army-list-rule.entity";
import { ArmyListUpgradeService } from "./army-list-upgrade/army-list-upgrade.service";
import { ArmyListUpgrade } from "./army-list-upgrade/army-list-upgrade.entity";

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
        const army: Army = await this.armyService.findOneById(armyId);
        if (army === null) {
            throw new BadRequestException("Invalid army id");
        }
        const list: ArmyList = await this.armyListService.create(req.user.username, name, army, cost, isShared, req.user.username)

        await this.armyListService.save(list);
        for (const unit of units) {
            const u: ArmyListUnit = await this.armyListUnitService.create(unit.unitId, unit.number, unit.formation, list.id);
            await this.armyListUnitService.save(u);
        }
        for (const rule of rulesIds) {
            const r: ArmyListRule = await this.armyListRuleService.create(list.id, rule);
            await this.armyListRuleService.save(r);
        }
        for (const upgrade of upgradesIds) {
            const u: ArmyListUpgrade = await this.armyListUpgradeService.create(list.id, upgrade);
            await this.armyListUpgradeService.save(u);
        }
    }
}
