import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Unit } from "../army/unit/unit.entity";
import { ArmyList } from "../army-list/army-list.entity";
import { ArmyListUnit } from "../army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitOption } from "../army-list/army-list-unit/army-list-unit-option/army-list-unit-option.entity";
import { ArmyListUnitUpgrade } from "../army-list/army-list-unit/army-list-unit-upgrade/army-list-unit-upgrade.entity";
import { ArmyListUpgrade } from "../army-list/army-list-upgrade/army-list-upgrade.entity";
import { ArmyListRule } from "../army-list/army-list-rule/army-list-rule.entity";
import { Army } from "../army/army.entity";
import { ArmyOrganisation } from "../army/organisation/army-organisation.entity";
import { ArmyOrganisationGroup } from "../army/organisation/group/army-organisation-group.entity";
import { MagicItemCategory } from "../army/magic-item/category/magic-item-category.entity";
import { MagicItem } from "../army/magic-item/magic-item.entity";
import { MagicStandard } from "../army/magic-standard/magic-standard.entity";
import { Equipment } from "../army/equipment/equipment.entity";
import { EquipmentCategory } from "../army/equipment/category/equipment-category.entity";
import { SpecialRule } from "../army/special-rule/special-rule.entity";
import { Troop } from "../army/unit/troop/troop.entity";

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
                Army,
                ArmyOrganisation,
                ArmyOrganisationGroup,
                MagicItemCategory,
                MagicItem,
                MagicStandard,
                Equipment,
                EquipmentCategory,
                Unit,
                Troop,
                SpecialRule,
                ArmyList,
                ArmyListUnit,
                ArmyListUnitOption,
                ArmyListUnitUpgrade,
                ArmyListUpgrade,
                ArmyListRule,
            ],
        });
    }
}
