import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArmyList } from "./army-list.entity";
import { Army } from "@army/army.entity";
import { ArmyListService } from "./army-list.service";
import { ArmyService } from "@army/army.service";

import { ArmyListController } from "./army-list.controller";
import { UnitModule } from "@army/unit/unit.module";
import { ArmyModule } from "@army/army.module";
import { ArmyListUnitModule } from "@army-list/army-list-unit/army-list-unit.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArmyList,
            Army
        ]),
        UnitModule,
        ArmyModule,
        ArmyListUnitModule
    ],
    providers: [
        ArmyListService,
        ArmyService
    ],
    exports: [ArmyListService, ArmyService],
    controllers: [ArmyListController]

})

export class ArmyListModule {}
