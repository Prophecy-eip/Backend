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
import MagicItemService from "@army/magic-item/magic-item.service";
import UnitOptionService from "@army/unit/option/unit-option.service";
import EquipmentService from "@army/equipment/equipment.service";
import MagicStandardService from "@army/magic-standard/magic-standard.service";
import SpecialRuleService from "@army/special-rule/special-rule.service";
import { MagicItem } from "@army/magic-item/magic-item.entity";
import { UnitOption } from "@army/unit/option/unit-option.entity";
import { Equipment } from "@army/equipment/equipment.entity";
import { MagicStandard } from "@army/magic-standard/magic-standard.entity";
import { SpecialRule } from "@army/special-rule/special-rule.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArmyListUnit,
            ArmyListUnitMagicItem,
            ArmyListUnitMagicStandard,
            ArmyListUnitOption,
            ArmyListUnitTroopSpecialRule,
            ArmyListUnitTroopEquipment,
            MagicItem,
            UnitOption,
            Equipment,
            MagicStandard,
            SpecialRule

        ]),
        UnitModule
    ],
    providers: [
        ArmyListUnitService,
        ArmyListUnitMagicItemService,
        ArmyListUnitMagicStandardService,
        ArmyListUnitOptionService,
        ArmyListUnitTroopSpecialRuleService,
        ArmyListUnitTroopEquipmentService,
        UnitOptionService,
        EquipmentService,
        MagicStandardService,
        MagicItemService,
        SpecialRuleService
    ],
    exports: [
        ArmyListUnitService,
        ArmyListUnitMagicItemService,
        ArmyListUnitMagicStandardService,
        ArmyListUnitOptionService,
        ArmyListUnitTroopSpecialRuleService,
        ArmyListUnitTroopEquipmentService,
        MagicItemService,
        UnitOptionService,
        EquipmentService,
        MagicStandardService,
        SpecialRuleService
    ]
})
export class ArmyListUnitModule {}
