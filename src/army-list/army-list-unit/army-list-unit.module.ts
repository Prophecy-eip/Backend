import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitMagicItem } from "@army-list/army-list-unit/magic-item/army-list-unit-magic-item.entity";
import {
    ArmyListUnitMagicStandard
} from "@army-list/army-list-unit/magic-standard/army-list-unit-magic-standard.entity";
import { ArmyListUnitOption } from "@army-list/army-list-unit/option/army-list-unit-option.entity";
import {
    ArmyListUnitTroopSpecialRule
} from "@army-list/army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.entity";
import {
    ArmyListUnitTroopEquipment
} from "@army-list/army-list-unit/troop/equipment/army-list-unit-troop-equipment.entity";
import { ArmyListUnitService } from "@army-list/army-list-unit/army-list-unit.service";
import { ArmyListUnitMagicItemService } from "@army-list/army-list-unit/magic-item/army-list-unit-magic-item.service";
import {
    ArmyListUnitMagicStandardService
} from "@army-list/army-list-unit/magic-standard/army-list-unit-magic-standard.service";
import { ArmyListUnitOptionService } from "@army-list/army-list-unit/option/army-list-unit-option.service";
import {
    ArmyListUnitTroopSpecialRuleService
} from "@army-list/army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.service";
import {
    ArmyListUnitTroopEquipmentService
} from "@army-list/army-list-unit/troop/equipment/army-list-unit-troop-equipment.service";
import { UnitModule } from "@army/unit/unit.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArmyListUnit,
            ArmyListUnitMagicItem,
            ArmyListUnitMagicStandard,
            ArmyListUnitOption,
            ArmyListUnitTroopSpecialRule,
            ArmyListUnitTroopEquipment
        ]),
        UnitModule
    ],
    providers: [
        ArmyListUnitService,
        ArmyListUnitMagicItemService,
        ArmyListUnitMagicStandardService,
        ArmyListUnitOptionService,
        ArmyListUnitTroopSpecialRuleService,
        ArmyListUnitTroopEquipmentService
    ],
    exports: [
        ArmyListUnitService,
        ArmyListUnitMagicItemService,
        ArmyListUnitMagicStandardService,
        ArmyListUnitOptionService,
        ArmyListUnitTroopSpecialRuleService,
        ArmyListUnitTroopEquipmentService
    ]
})
export class ArmyListUnitModule {}
