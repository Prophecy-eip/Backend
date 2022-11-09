import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Rule } from "../army/rule/rule.entity";
import { UnitCategory } from "../army/unit/unit-category/unit-category.entity";
import { Upgrade } from "../army/upgrade/upgrade.entity";
import { UpgradeCategory } from "../army/upgrade/upgrade-category/upgrade-category.entity";
import { SpecialItemCategory } from "../army/special-item/special-item-category/special-item-category.entity";
import { SpecialItem } from "../army/special-item/special-item.entity";
import { Option } from "../army/option/option.entity";
import { UnitProfile } from "../army/unit/unit-profile/unit-profile.entity";
import { Modifier } from "../army/modifier/modifier.entity";
import { Unit } from "../army/unit/unit.entity";
import { ArmyList } from "../army-list/army-list.entity";
import { ArmyListUnit } from "../army-list/army-list-unit/army-list-unit.entity";

dotenv.config()

const DB = process.env.POSTGRES_DB;
const DB_HOST = process.env.DATABASE_IP;
const DB_PORT: number = +process.env.DATABASE_PORT;
const DB_USERNAME = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_DIALECT = "postgres";

export class ProphecyDatasource extends DataSource {
    constructor() {
        super({
            type: DB_DIALECT,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [
                UnitCategory,
                Unit,
                Rule,
                Upgrade,
                UpgradeCategory,
                SpecialItemCategory,
                SpecialItem,
                Option,
                UnitProfile,
                Modifier,
                ArmyList,
                ArmyListUnit,
            ],
        });
    }
}
