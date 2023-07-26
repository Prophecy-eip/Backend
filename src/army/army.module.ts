import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Army } from "./army.entity";
import { Equipment } from "./equipment/equipment.entity";
import { EquipmentCategory } from "./equipment/category/equipment-category.entity";
import { MagicItem } from "./magic-item/magic-item.entity";
import { MagicItemCategory } from "./magic-item/category/magic-item-category.entity";
import { ArmyOrganisation } from "./organisation/army-organisation.entity";
import { ArmyOrganisationGroup } from "./organisation/group/army-organisation-group.entity";
import { SpecialRule } from "./special-rule/special-rule.entity";
import { Unit } from "./unit/unit.entity";
import { UnitOption } from "./unit/option/unit-option.entity";
import { Troop } from "./unit/troop/troop.entity";
import { EquipmentUnitTroop } from "./unit/troop/equipment/equipment-unit-troop.entity";
import { SpecialRuleUnitTroop } from "./unit/troop/special-rule/special-rule-unit-troop.entity";
import { ArmyService } from "./army.service";
import { ArmyController } from "./army.controller";
import { UnitService } from "@army/unit/troop/unit.service";
import { UnitModule } from "@army/unit/unit.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Army,
            Equipment,
            EquipmentCategory,
            MagicItem,
            MagicItemCategory,
            ArmyOrganisation,
            ArmyOrganisationGroup,
            SpecialRule,
            UnitOption,
            Troop,
            EquipmentUnitTroop,
            SpecialRuleUnitTroop
        ]),
        UnitModule
    ],
    providers: [ArmyService],
    exports: [ArmyService, UnitModule],
    controllers: [ArmyController]
})
export class ArmyModule {}
