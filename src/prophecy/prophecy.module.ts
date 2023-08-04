import { Module } from "@nestjs/common";
import { ProphecyUnit } from "./unit/prophecy-unit.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProphecyUnitService } from "./unit/prophecy-unit.service";
import { ProphecyController } from "./prophecy.controller";
import { UnitModule } from "@army/unit/unit.module";
import { ArmyListUnitModule } from "@army-list/army-list-unit/army-list-unit.module";

@Module({
    imports: [TypeOrmModule.forFeature([
        ProphecyUnit
    ]),
        UnitModule,
        ArmyListUnitModule
    ],
    providers: [ProphecyUnitService],
    exports: [],
    controllers: [ProphecyController]
})
export class ProphecyModule {}
