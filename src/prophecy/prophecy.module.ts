import { Module } from "@nestjs/common";
import { ProphecyUnit } from "./unit/prophecy-unit.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProphecyUnitService } from "./unit/prophecy-unit.service";
import { ProphecyController } from "./prophecy.controller";
import { ArmyListUnitService } from "@army-list/army-list-unit/army-list-unit.service";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { UnitModule } from "@army/unit/unit.module";

@Module({
    imports: [TypeOrmModule.forFeature([
        ProphecyUnit,
        ArmyListUnit
    ]),
        UnitModule
    ],
    providers: [ProphecyUnitService, ArmyListUnitService],
    exports: [],
    controllers: [ProphecyController]
})
export class ProphecyModule {}
