import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";

import { Profile } from "@account/profile/profile.entity";
import { Army } from "@army/army.entity";
import { Unit } from "@army/unit/unit.entity";
import { Equipment } from "@army/equipment/equipment.entity";
import { EquipmentCategory } from "@army/equipment/category/equipment-category.entity";
import { MagicItem } from "@army/magic-item/magic-item.entity";
import { MagicItemCategory } from "@army/magic-item/category/magic-item-category.entity";
import { ArmyOrganisation } from "@army/organisation/army-organisation.entity";
import { ArmyOrganisationGroup } from "@army/organisation/group/army-organisation-group.entity";
import { SpecialRule } from "@army/special-rule/special-rule.entity";
import { UnitOption } from "@army/unit/option/unit-option.entity";
import { Troop } from "@army/unit/troop/troop.entity";
import { EquipmentUnitTroop } from "@army/unit/troop/equipment/equipment-unit-troop.entity";
import { SpecialRuleUnitTroop } from "@army/unit/troop/special-rule/special-rule-unit-troop.entity";
import { ArmyList } from "@army-list/army-list.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitMagicItem } from "@army-list/army-list-unit/magic-item/army-list-unit-magic-item.entity";
import {
    ArmyListUnitMagicStandard
} from "@army-list/army-list-unit/magic-standard/army-list-unit-magic-standard.entity";
import { ArmyListUnitOption } from "@army-list/army-list-unit/option/army-list-unit-option.entity";
import {
    ArmyListUnitTroopSpecialRule
} from "@army-list/army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.entity";
import {
    ArmyListUnitTroopEquipment
} from "@army-list/army-list-unit/troop/equipment/army-list-unit-troop-equipment.entity";
import { ProphecyUnit } from "@prophecy/unit/prophecy-unit.entity";

import { ArmyModule } from "@army/army.module";
import { AccountModule } from "@account/account.module";
import { ArmyListModule } from "@army-list/army-list.module";
import { HeartbeatModule } from "@heartbeat/heartbeat.module";
import { ProphecyModule } from "@prophecy/prophecy.module";
import { AppController } from "./app.controller";
import { ProfileModule } from "@account/profile/profile.module";
import { GameModule } from "@app/game/game.module";
import { Game } from "@app/game/game.entity";
import { ProphecyArmy } from "@prophecy/army/prophecy-army.entity";
import { MagicStandard } from "@army/magic-standard/magic-standard.entity";

dotenv.config();

const DB = process.env.POSTGRES_DB;
const DB_HOST = process.env.DATABASE_IP;
const DB_PORT: number = +process.env.DATABASE_PORT;
const DB_USERNAME = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_DIALECT = "postgres";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_DIALECT,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            extra: {
                connectionLimit: 5
            },
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
                MagicStandard,
                EquipmentUnitTroop,
                SpecialRuleUnitTroop,
                ArmyList,
                ArmyListUnit,
                ArmyListUnitMagicItem,
                ArmyListUnitMagicStandard,
                ArmyListUnitOption,
                ArmyListUnitTroopSpecialRule,
                ArmyListUnitTroopEquipment,
                ProphecyUnit,
                Game,
                ProphecyArmy
            ],
            synchronize: false
        }),
        AccountModule,
        ArmyModule,
        ArmyListModule,
        HeartbeatModule,
        ProphecyModule,
        ProfileModule,
        GameModule
    ],
    controllers: [AppController]
})
export class AppModule {}
