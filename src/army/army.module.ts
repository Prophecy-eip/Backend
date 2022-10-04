import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Army } from "./army.entity";
import { Unit } from "./unit/unit.entity";
import { UnitCategory } from "./unit/unit-category/unit-category.entity";
import { Rule } from "./rule/rule.entity";
import { UnitProfile } from "./unit/unit-profile/unit-profile.entity";
import { UpgradeCategory } from "./upgrade/upgrade-category/upgrade-category.entity";
import { Option } from "./option/option.entity"
import { Modifier } from "./modifier/modifier.entity";
import { Upgrade } from "./upgrade/upgrade.entity";
import { SpecialItemCategory } from "./special-item/special-item-category/special-item-category.entity";
import { SpecialItem } from "./special-item/special-item.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Army,
            UnitCategory,
            Unit,
            Rule,
            UnitProfile,
            UpgradeCategory,
            Option,
            Modifier,
            UpgradeCategory,
            Upgrade,
            SpecialItemCategory,
            SpecialItem
        ])
    ],
    providers: [],
    exports: []
})
export class ArmyModule {}
