import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";

import { Profile } from "./account/profile/profile.entity";
import { Army } from "./army/army.entity"
import { Unit } from "./army/unit/unit.entity";
import { UnitCategory } from "./army/unit/unit-category/unit-category.entity";
import { Rule } from "./army/rule/rule.entity";
import { UnitProfile } from "./army/unit/unit-profile/unit-profile.entity";
import { UpgradeCategory } from "./army/upgrade/upgrade-category/upgrade-category.entity";
import { Option } from "./army/option/option.entity";
import { Modifier } from "./army/modifier/modifier.entity";
import { Upgrade } from "./army/upgrade/upgrade.entity";
import { SpecialItemCategory } from "./army/special-item/special-item-category/special-item-category.entity";
import { SpecialItem } from "./army/special-item/special-item.entity";
import { ArmyList } from "./army-list/army-list.entity";
import { ArmyListUnit } from "./army-list/army-list-unit/army-list-unit.entity";
import { ArmyListRule } from "./army-list/army-list-rule/army-list-rule.entity";
import { ArmyListUpgrade } from "./army-list/army-list-upgrade/army-list-upgrade.entity";
import { ArmyListUnitOption } from "./army-list/army-list-unit/army-list-unit-option/army-list-unit-option.entity";
import { ArmyListUnitUpgrade } from "./army-list/army-list-unit/army-list-unit-upgrade/army-list-unit-upgrade.entity";

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
                UnitCategory,
                Unit,
                Rule,
                UnitProfile,
                UpgradeCategory,
                Option,
                Modifier,
                Upgrade,
                UpgradeCategory,
                SpecialItemCategory,
                SpecialItem,
                ArmyList,
                ArmyListUnit,
                ArmyListRule,
                ArmyListUpgrade,
                ArmyListUnitOption,
                ArmyListUnitUpgrade,
            ],
            synchronize: false
        }),
        AccountModule,
        ArmyModule,
        ArmyListModule,
        HeartbeatModule
    ],
})
export class AppModule {}
