import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

import { ArmyList } from "@army-list/army-list.entity";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { Army } from "@army/army.entity";
import { ArmyOrganisation } from "@army/organisation/army-organisation.entity";
import { ArmyOrganisationGroup } from "@army/organisation/group/army-organisation-group.entity";
import { MagicItemCategory } from "@army/magic-item/category/magic-item-category.entity";
import { MagicItem } from "@army/magic-item/magic-item.entity";
import { MagicStandard } from "@army/magic-standard/magic-standard.entity";
import { Equipment } from "@army/equipment/equipment.entity";
import { EquipmentCategory } from "@army/equipment/category/equipment-category.entity";
import { SpecialRule } from "@army/special-rule/special-rule.entity";
import { Troop } from "@army/unit/troop/troop.entity";
import { SpecialRuleUnitTroop } from "@army/unit/troop/special-rule/special-rule-unit-troop.entity";
import { EquipmentUnitTroop } from "@army/unit/troop/equipment/equipment-unit-troop.entity";
import { UnitOption } from "@army/unit/option/unit-option.entity";
import { Unit } from "@army/unit/unit.entity";
import { ArmyListUnitMagicItem } from "@army-list/army-list-unit/magic-item/army-list-unit-magic-item.entity";
import { ArmyListUnitMagicStandard } from "@army-list/army-list-unit/magic-standard/army-list-unit-magic-standard.entity";
import { ArmyListUnitOption } from "@army-list/army-list-unit/option/army-list-unit-option.entity";
import { ArmyListUnitTroopEquipment } from "@army-list/army-list-unit/troop/equipment/army-list-unit-troop-equipment.entity";
import { ArmyListUnitTroopSpecialRule } from "@army-list/army-list-unit/troop/special-rule/army-list-unit-troop-special-rule.entity";

dotenv.config();

const DB = process.env.POSTGRES_DB;
const DB_HOST = process.env.DATABASE_IP;
const DB_PORT: number = +process.env.DATABASE_PORT;
const DB_USERNAME = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_DIALECT = "postgres";

/**
 * @class ProphecyDatasource
 * @brief Implements a datasource for Prophecy's features
 */
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
                UnitOption,
                Troop,
                SpecialRuleUnitTroop,
                EquipmentUnitTroop,
                UnitOption,
                SpecialRule,
                ArmyList,
                ArmyListUnit,
                ArmyListUnitMagicItem,
                ArmyListUnitMagicStandard,
                ArmyListUnitOption,
                ArmyListUnitTroopEquipment,
                ArmyListUnitTroopSpecialRule
            ]
        });
    }
}
