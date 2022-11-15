import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArmyList } from "./army-list.entity";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";
import { Army } from "../army/army.entity";
import { Rule } from "../army/rule/rule.entity"
import { Upgrade } from "../army/upgrade/upgrade.entity";
import { Unit } from "../army/unit/unit.entity";
import { ArmyListRule } from "./army-list-rule/army-list-rule.entity";
import { ArmyListUpgrade } from "./army-list-upgrade/army-list-upgrade.entity";

import { ArmyListService } from "./army-list.service";
import { ArmyService } from "../army/army.service";
import { RuleService } from "../army/rule/rule.service";
import { UpgradeService } from "../army/upgrade/upgrade.service";
import { ArmyListUnitService } from "./army-list-unit/army-list-unit.service";
import { UnitService } from "../army/unit/unit.service";
import { ArmyListRuleService } from "./army-list-rule/army-list-rule.service";
import { ArmyListUpgradeService } from "./army-list-upgrade/army-list-upgrade.service";

import { ArmyListController } from "./army-list.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArmyList,
            ArmyListUnit,
            Army,
            Rule,
            Upgrade,
            Unit,
            ArmyListRule,
            ArmyListUpgrade,
        ])
    ],
    providers: [
        ArmyListService,
        ArmyService,
        RuleService,
        UpgradeService,
        ArmyListUnitService,
        UnitService,
        ArmyListRuleService,
        ArmyListUpgradeService,
    ],
    exports: [],
    controllers: [ArmyListController]

})
export class ArmyListModule {}