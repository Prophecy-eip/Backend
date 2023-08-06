import { Module } from "@nestjs/common";
import { ProphecyUnit } from "./unit/prophecy-unit.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProphecyUnitService } from "./unit/prophecy-unit.service";
import { ProphecyController } from "./prophecy.controller";
import { UnitModule } from "@army/unit/unit.module";
import { ArmyListUnitModule } from "@army-list/army-list-unit/army-list-unit.module";
import { ProphecyArmy } from "@prophecy/army/prophecy-army.entity";
import ProphecyMathsService from "@prophecy/maths/prophecy-maths.service";
import ProphecyArmyService from "@prophecy/army/prophecy-army.service";
import { ArmyListModule } from "@army-list/army-list.module";

@Module({
    imports: [TypeOrmModule.forFeature([
        ProphecyUnit,
        ProphecyArmy
    ]),
        UnitModule,
        ArmyListUnitModule,
        ArmyListModule
    ],
    providers: [ProphecyUnitService, ProphecyArmyService, ProphecyMathsService],
    exports: [ProphecyUnitService, ProphecyArmyService, ProphecyMathsService],
    controllers: [ProphecyController]
})
export class ProphecyModule {}
