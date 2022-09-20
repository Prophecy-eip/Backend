import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Army } from "./army.entity";
import { Organisation } from "./organisation/organisation.entity";
import { Unit } from "./unit/unit.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Army, Organisation, Unit])
    ],
    providers: [],
    exports: []
})
export class ArmyModule {}