import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Unit } from "@army/unit/unit.entity";
import { UnitService } from "@army/unit/troop/unit.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Unit
        ])
    ],
    providers: [UnitService],
    exports: [UnitService]
})
export class UnitModule {}
