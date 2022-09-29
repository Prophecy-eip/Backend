import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Army } from "./army.entity";
import { Unit } from "./unit/unit.entity";
import { UnitCategory } from "./unit-category/unit-category.entity";
import { Rule } from "./rule/rule.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Army, UnitCategory
            , Unit, Rule])
    ],
    providers: [],
    exports: []
})
export class ArmyModule {}