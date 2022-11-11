import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArmyList } from "./army-list.entity";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";
import { ArmyListService } from "./army-list.service";
import { ArmyListController } from "./army-list.controller";
import {ArmyService} from "../army/army.service";
import {Army} from "../army/army.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArmyList,
            ArmyListUnit,
            Army
        ])
    ],
    providers: [ArmyListService, ArmyService],
    exports: [],
    controllers: [ArmyListController]

})
export class ArmyListModule {}