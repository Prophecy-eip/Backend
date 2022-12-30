import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";

import { Profile } from "./account/profile/profile.entity";
import { Army } from "./army/army.entity"
import { Unit } from "./army/unit/unit.entity";
import { ArmyList } from "./army-list/army-list.entity";
import { ArmyListUnit } from "./army-list/army-list-unit/army-list-unit.entity";
import { ArmyListRule } from "./army-list/army-list-rule/army-list-rule.entity";
import { ArmyListUpgrade } from "./army-list/army-list-upgrade/army-list-upgrade.entity";
import { ArmyListUnitOption } from "./army-list/army-list-unit/army-list-unit-option/army-list-unit-option.entity";
import { ArmyListUnitUpgrade } from "./army-list/army-list-unit/army-list-unit-upgrade/army-list-unit-upgrade.entity";
import { Equipment } from "./army/equipment/equipment.entity";
import { EquipmentCategory } from "./army/equipment/category/equipment-category.entity";
import { MagicItem } from "./army/magic-item/magic-item.entity";
import { MagicItemCategory } from "./army/magic-item/category/magic-item-category.entity";
import { ArmyOrganisation } from "./army/organisation/army-organisation.entity";
import { ArmyOrganisationGroup } from "./army/organisation/group/army-organisation-group.entity";
import { SpecialRule } from "./army/special-rule/special-rule.entity";
import { UnitOption } from "./army/unit/option/unit-option.entity";
import { Troop } from "./army/unit/troop/troop.entity";
import { EquipmentUnitTroop } from "./army/unit/troop/equipment/equipment-unit-troop.entity";
import { SpecialRuleUnitTroop } from "./army/unit/troop/special-rule/special-rule-unit-troop.entity";

import { ArmyModule } from "./army/army.module"
import { AccountModule } from "./account/account.module";
import { ArmyListModule } from "./army-list/army-list.module";
import { HeartbeatModule } from "./heartbeat/heartbeat.module";

dotenv.config()

const DB = process.env.POSTGRES_DB;
const DB_HOST = process.env.DATABASE_IP;
const DB_PORT: number = +process.env.DATABASE_PORT;
const DB_USERNAME = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_DIALECT = "postgres"

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_DIALECT,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [
                Profile,
                Army,
                Equipment,
                EquipmentCategory,
                MagicItem,
                MagicItemCategory,
                ArmyOrganisation,
                ArmyOrganisationGroup,
                SpecialRule,
                Unit,
                UnitOption,
                Troop,
                EquipmentUnitTroop,
                SpecialRuleUnitTroop,
                // ArmyList,
                // ArmyListUnit,
                // ArmyListRule,
                // ArmyListUpgrade,
                // ArmyListUnitOption,
                // ArmyListUnitUpgrade,
            ],
            synchronize: false
        }),
        AccountModule,
        ArmyModule,
        // ArmyListModule,
        HeartbeatModule,
    ],
})
export class AppModule {}
