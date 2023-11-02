import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Unit } from "@army/unit/unit.entity";
import { UnitService } from "@army/unit/unit.service";
import { Troop } from "@army/unit/troop/troop.entity";
import { TroopService } from "@army/unit/troop/troop.service";
import { SpecialRuleUnitTroop } from "@army/unit/troop/special-rule/special-rule-unit-troop.entity";
import { EquipmentUnitTroop } from "@army/unit/troop/equipment/equipment-unit-troop.entity";
import { UnitOption } from "@army/unit/option/unit-option.entity";
import SpecialRuleUnitTroopService from "@army/unit/troop/special-rule/special-rule-unit-troop.service";
import EquipmentUnitTroopService from "@army/unit/troop/equipment/equipment-unit-troop.service";
import UnitOptionService from "@army/unit/option/unit-option.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Unit,
            Troop,
            SpecialRuleUnitTroop,
            EquipmentUnitTroop,
            UnitOption
        ])
    ],
    providers: [UnitService, TroopService, SpecialRuleUnitTroopService, EquipmentUnitTroopService, UnitOptionService],
    exports: [UnitService, TroopService, SpecialRuleUnitTroopService, EquipmentUnitTroopService, UnitOptionService]
})
export class UnitModule {}
