import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Profile } from "../../account/profile/profile.entity";

// import { Rule } from "../../army/rule/rule.entity";
// import { UnitCategory } from "../../army/unit/unit-category/unit-category.entity";
// import { Upgrade } from "../../army/upgrade/upgrade.entity";
// import { UpgradeCategory } from "../../army/upgrade/upgrade-category/upgrade-category.entity";
// import { SpecialItemCategory } from "../../army/special-item/special-item-category/special-item-category.entity";
// import { SpecialItem } from "../../army/special-item/special-item.entity";
// import { Option } from "../../army/option/option.entity";
// import { UnitProfile } from "../../army/unit/unit-profile/unit-profile.entity";
// import { Modifier } from "../../army/modifier/modifier.entity";
// import { Unit } from "../../army/unit/unit.entity";


import { Army } from "../../army/army.entity"
import { ArmyOrganisation } from "../../army/organisation/army-organisation.entity"
import { ArmyOrganisationGroup } from "../../army/organisation/group/army-organisation-group.entity";
import { Equipment } from "../../army/equipment/equipment.entity";
import { EquipmentCategory } from "../../army/equipment/category/equipment-category.entity";
import { MagicItem } from "../../army/magic-item/magic-item.entity";
import { MagicItemCategory } from "../../army/magic-item/category/magic-item-category.entity";
import { MagicStandard } from "../../army/magic-standard/magic-standard.entity";
// import { ArmyList } from "../../army-list/army-list.entity";
// import { ArmyListUnit } from "../../army-list/army-list-unit/army-list-unit.entity";

import { UsersInitialization1667924495954 } from "./1667924495954-UsersInitialization";
import { ArmiesInitialization1671123394624 } from "./1671123394624-ArmiesInitialization";
import { SpecialRule } from "../../army/special-rule/special-rule.entity";

dotenv.config()

const DB = process.env.POSTGRES_DB;
const DB_HOST = process.env.DATABASE_IP;
const DB_PORT: number = +process.env.DATABASE_PORT;
const DB_USERNAME = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_DIALECT = "postgres";

export const connectionSource = new DataSource({
    type: DB_DIALECT,
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB,
    entities: [
        Profile,
        Army,
        ArmyOrganisation,
        ArmyOrganisationGroup,
        Equipment,
        EquipmentCategory,
        MagicItem,
        MagicItemCategory,
        SpecialRule,
        MagicStandard
    ],
    migrations: [
        UsersInitialization1667924495954,
        ArmiesInitialization1671123394624,
    ]
});
