import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArmyList } from "./army-list.entity";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";
import { ArmyListService } from "./army-list.service";
import { ArmyListController } from "./army-list.controller";
import {ArmyService} from "../army/army.service";
import {Army} from "../army/army.entity";
import {RuleService} from "../army/rule/rule.service";
import {UpgradeService} from "../army/upgrade/upgrade.service";
import { Rule } from "../army/rule/rule.entity"
import {Upgrade} from "../army/upgrade/upgrade.entity";
import {ArmyListUnitService} from "./army-list-unit/army-list-unit.service";
import {Unit} from "../army/unit/unit.entity";
import {UnitService} from "../army/unit/unit.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArmyList,
            ArmyListUnit,
            Army,
            Rule,
            Upgrade,
            Unit,
        ])
    ],
    providers: [ArmyListService, ArmyService, RuleService, UpgradeService, ArmyListUnitService, UnitService],
    exports: [],
    controllers: [ArmyListController]

})
export class ArmyListModule {}