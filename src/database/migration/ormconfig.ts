import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Profile } from "../../account/profile/profile.entity";

import { Army } from "../../army/army.entity"
import { ArmyOrganisation } from "../../army/organisation/army-organisation.entity"
import { ArmyOrganisationGroup } from "../../army/organisation/group/army-organisation-group.entity";
import { Equipment } from "../../army/equipment/equipment.entity";
import { EquipmentCategory } from "../../army/equipment/category/equipment-category.entity";
import { MagicItem } from "../../army/magic-item/magic-item.entity";
import { MagicItemCategory } from "../../army/magic-item/category/magic-item-category.entity";
import { MagicStandard } from "../../army/magic-standard/magic-standard.entity";
import { SpecialRule } from "../../army/special-rule/special-rule.entity";
import { ArmyList } from "../../army-list/army-list.entity";
import { ArmyListUnit } from "../../army-list/army-list-unit/army-list-unit.entity";
import { ArmyListUnitMagicItem } from "../../army-list/army-list-unit/magic-item/army-list-unit-magic-item.entity";
import { ArmyListUnitMagicStandard } from "../../army-list/army-list-unit/magic-standard/army-list-unit-magic-standard.entity";
import { ArmyListUnitOption } from "../../army-list/army-list-unit/option/army-list-unit-option.entity";
import { Troop } from "../../army/unit/troop/troop.entity";

import { UsersInitialization1667924495954 } from "./1667924495954-UsersInitialization";
import { ArmiesInitialization1671123394624 } from "./1671123394624-ArmiesInitialization";
import { ArmyListsInitialization1672323186772 } from "./1672323186772-ArmyListsInitialization";
import { ProphecyUnitInitialization1672968324920 } from "./1672968324920-ProphecyUnitInitialization";
import { ProphecyUnit } from "../../prophecy/unit/prophecy-unit.entity";
import { AddProphecyUnitAttackingPosition1675176923116 } from "./1675176923116-AddProphecyUnitAttackingPosition";

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
        MagicStandard,
        ArmyList,
        ArmyListUnit,
        ArmyListUnitMagicItem,
        ArmyListUnitMagicStandard,
        ArmyListUnitOption,
        Troop,
        ProphecyUnit,
    ],
    migrations: [
        UsersInitialization1667924495954,
        ArmiesInitialization1671123394624,
        ArmyListsInitialization1672323186772,
        ProphecyUnitInitialization1672968324920,
        AddProphecyUnitAttackingPosition1675176923116,
    ]
});
