import {Controller, HttpCode, HttpStatus, Body, Post, Request, UseGuards, BadRequestException} from "@nestjs/common";

import { ArmyListService } from "./army-list.service";
import { ArmyListDTO } from "./army-list.dto";
import { JwtAuthGuard } from "../account/auth/guards/jwt-auth.guard";
import {ArmyListUnitDTO} from "./army-list-unit/army-list-unit.dto";
import {ParamHelper} from "../helper/param.helper";
import {ArmyService} from "../army/army.service";
import {Army} from "../army/army.entity";
import {ArmyList} from "./army-list.entity";
import {Upgrade} from "../army/upgrade/upgrade.entity";
import {Rule} from "../army/rule/rule.entity";
import {RuleService} from "../army/rule/rule.service";
import {UpgradeService} from "../army/upgrade/upgrade.service";
import {ArmyListUnit} from "./army-list-unit/army-list-unit.entity";
import {Unit} from "../army/unit/unit.entity";
import {UnitService} from "../army/unit/unit.service";
import {randomUUID} from "crypto";
import {ArmyListUnitService} from "./army-list-unit/army-list-unit.service";

@Controller("armies-lists")
export class ArmyListController {
    constructor(
        private readonly armyListService: ArmyListService,
        private readonly armyService: ArmyService,
        private readonly ruleService: RuleService,
        private readonly upgradeService: UpgradeService,
        private readonly unitService: UnitService,
        private readonly armyListUnitService: ArmyListUnitService,
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
        const rules: Rule[] = await this.ruleService.findByIds(rulesIds);
        let upgrades: Upgrade[] = await this.upgradeService.findByIds(upgradesIds);
        const listUnits: ArmyListUnit[] = [];
        for (const unit of units) {
            // const u: Unit = await this.unitService.findOneById(unit.unitId);
            listUnits.push(await this.armyListUnitService.create(unit.unitId, [], [], unit.number, unit.formation))
        }
        const list: ArmyList = await this.armyListService.create(req.user.username, name, army, cost, upgrades, rules, isShared)
        console.log(list);
        for (const unit of listUnits) {
            await this.armyListUnitService.save(unit);
        }
        await this.armyListService.save(list);
    }
}
