import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArmyList } from "./army-list.entity";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";
import { Army } from "../army/army.entity";
import { Unit } from "../army/unit/unit.entity";
import { ArmyListUnitMagicItem } from "./army-list-unit/magic-item/army-list-unit-magic-item.entity";
import { ArmyListUnitMagicStandard } from "./army-list-unit/magic-standard/army-list-unit-magic-standard.entity";
import { ArmyListUnitOption } from "./army-list-unit/option/army-list-unit-option.entity";
import {
    ArmyListUnitTroopSpecialRule
} from "./army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.entity";
import { ArmyListUnitTroopEquipment } from "./army-list-unit/troop/equipment/army-list-unit-troop-equipment.entity";

import { ArmyListService } from "./army-list.service";
import { ArmyService } from "../army/army.service";
import { ArmyListUnitService } from "./army-list-unit/army-list-unit.service";
import { ArmyListUnitMagicItemService } from "./army-list-unit/magic-item/army-list-unit-magic-item.service";
import {
    ArmyListUnitMagicStandardService
} from "./army-list-unit/magic-standard/army-list-unit-magic-standard.service";
import { ArmyListUnitOptionService } from "./army-list-unit/option/army-list-unit-option.service";
import {
    ArmyListUnitTroopSpecialRuleService
} from "./army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.service";
import {
    ArmyListUnitTroopEquipmentService
} from "./army-list-unit/troop/equipment/army-list-unit-troop-equipment.service";

import { ArmyListController } from "./army-list.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArmyList,
            ArmyListUnit,
            ArmyListUnitMagicItem,
            ArmyListUnitMagicStandard,
            ArmyListUnitOption,
            ArmyListUnitTroopSpecialRule,
            ArmyListUnitTroopEquipment,
            Army,
            Unit,
        ])
    ],
    providers: [
        ArmyListService,
        ArmyService,
        ArmyListUnitService,
        ArmyListUnitMagicItemService,
        ArmyListUnitMagicStandardService,
        ArmyListUnitOptionService,
        ArmyListUnitTroopSpecialRuleService,
        ArmyListUnitTroopEquipmentService,
    ],
    exports: [],
    controllers: [ArmyListController]

})
export class ArmyListModule {}
