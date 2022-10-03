import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Army } from "./army.entity";
import { Unit } from "./unit/unit.entity";
import { UnitCategory } from "./unit/unit-category/unit-category.entity";
import { Rule } from "./rule/rule.entity";
import {UnitProfile} from "./unit/unit-profile/unit-profile.entity";
import {UpgradeCategory} from "./upgrade-category/upgrade-category.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Army, UnitCategory
            , Unit, Rule, UnitProfile, UpgradeCategory])
    ],
    providers: [],
    exports: []
})
export class ArmyModule {}