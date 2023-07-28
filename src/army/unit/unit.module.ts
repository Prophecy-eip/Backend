import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Unit } from "@army/unit/unit.entity";
import { UnitService } from "@army/unit/unit.service";
import { Troop } from "@army/unit/troop/troop.entity";
import { TroopService } from "@army/unit/troop/troop.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Unit,
            Troop
        ])
    ],
    providers: [UnitService, TroopService],
    exports: [UnitService, TroopService]
})
export class UnitModule {}
