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

@Controller("armies-lists")
export class ArmyListController {
    constructor(
        private readonly armyListService: ArmyListService,
        private readonly armyService: ArmyService,
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
                 @Body("rules") rules: string[],
                 @Body("isShared") isShared?: boolean) {
        if (!ParamHelper.isValid(name) || !ParamHelper.isValid(armyId) || !ParamHelper.isValid(cost) ||
            !ParamHelper.isValid(units) || !ParamHelper.isValid(upgradesIds) || !ParamHelper.isValid(rules)) {
            throw new BadRequestException();
        }
        const army: Army = await this.armyService.findOneById(armyId);
        if (army === null) {
            throw new BadRequestException("Invalid army id");
        }
        let upgrades: Upgrade[] = [];
        const list: ArmyList = await this.armyListService.create(req.user.username, name, army, cost, [], [], [], isShared)
        console.log(list);
    }
}
