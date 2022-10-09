import {Controller, HttpCode, HttpStatus, Get, Param, NotFoundException} from "@nestjs/common"

import { ArmyService } from "./army.service";
import { UnitService } from "./unit/unit.service";
import { ArmyDTO } from "./army.dto";
import { Army } from "./army.entity";
import { Unit } from "./unit/unit.entity";
import { UnitCategoryService } from "./unit/unit-category/unit-category.service";
import {UnitCategory} from "./unit/unit-category/unit-category.entity";
import {UnitDTO} from "./unit/unit.dto";
import {UnitProfile} from "./unit/unit-profile/unit-profile.entity";
import {UnitProfileService} from "./unit/unit-profile/unit-profile.service";

import { ParserHelper } from "../helper/parser.helper";
import {OptionService} from "./option/option.service";
import {Option} from "./option/option.entity";

@Controller("armies")
export class ArmyController {
    constructor(
        private readonly armyService: ArmyService,
        private readonly unitService: UnitService,
        private readonly unitCategoryService: UnitCategoryService,
        private readonly unitProfileService: UnitProfileService,
        private readonly optionService: OptionService,
    ) {}

    @Get("lookup")
    @HttpCode(HttpStatus.OK)
    async lookup() {
        const a =  await this.armyService.getAll();
        return(a);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async get(@Param("id") id: string) {
        const army: Army = await this.armyService.findOneById(id);
        if (army === null) {
            throw new NotFoundException();
        }
        return new ArmyDTO(army);
    }
}