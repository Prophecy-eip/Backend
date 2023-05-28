import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

const ARMIES_TABLE: Table = new Table({
    name: "armies",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "name",
            type: "varchar",
            isNullable: true
        }, {
            name: "version_id",
            type: "int"
        }, {
            name: "category_id",
            type: "int",
            isNullable: true
        }, {
            name: "source",
            type: "varchar",
            isNullable: true
        }, {
            name: "equipment_limits",
            type: "varchar",
            isNullable: true
        }, {
            name: "special_rule_limits",
            type: "varchar",
            isNullable: true
        }, {
            name: "organisation_ids",
            type: "int",
            isArray: true,
            isNullable: true
        }, {
            name: "magic_item_category_ids",
            type: "int",
            isArray: true,
            isNullable: true
        }, {
            name: "magic_item_ids",
            type: "int",
            isArray: true,
            isNullable: true
        }, {
            name: "magic_standard_ids",
            type: "int",
            isArray: true,
            isNullable: true
        }, {
            name: "equipment_ids",
            type: "int",
            isArray: true,
            isNullable: true
        }, {
            name: "rule_ids",
            type: "int",
            isArray: true,
            isNullable: true
        }, {
            name: "unit_ids",
            type: "int",
            isArray: true,
            isNullable: true
        }
    ]
});

const EQUIPMENT_CATEGORIES_TABLE: Table = new Table({
    name: "equipment_categories",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "version_id",
            type: "int",
            isNullable: true
        }, {
            name: "name",
            type: "varchar",
            isNullable: true
        }
    ]
});

const EQUIPMENTS_TABLE: Table = new Table({
    name: "equipments",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "version_id",
            type: "int",
            isNullable: true
        }, {
            name: "name",
            type: "varchar",
            isNullable: true
        }, {
            name: "description",
            type: "varchar",
            isNullable: true
        }, {
            name: "type_lvl",
            type: "varchar",
            isNullable: true
        }, {
            name: "can_be_enchanted",
            type: "boolean"
        }, {
            name: "equipment_categories",
            type: "int",
            isArray: true,
            isNullable: true
        }
    ]
});

const ARMY_ORGANISATION_TABLE: Table = new Table({
    name: "army_organisations",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "name",
            type: "varchar",
            isNullable: true
        }, {
            name: "description",
            type: "varchar",
            isNullable: true
        }, {
            name: "is_default",
            type: "boolean",
            isNullable: true
        }, {
            name: "organisation_group_ids",
            type: "int",
            isNullable: true,
            isArray: true
        }
    ]
});

const ARMY_ORGANISATION_GROUP_TABLE: Table = new Table({
    name: "army_organisation_groups",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "army_organisation_id",
            type: "int",
            isNullable: true
        }, {
            name: "name",
            type: "varchar",
            isNullable: true
        }, {
            name: "organisation_group_limits",
            type: "json",
            isNullable: true
        }, {
            name: "organisation_unit_limits",
            type: "varchar",
            isNullable: true,
            isArray: true
        }, {
            name: "change_item_limits",
            type: "varchar",
            isNullable: true
        }
    ]
});

const MAGIC_ITEM_CATEGORIES_TABLE: Table = new Table({
   name: "magic_item_categories",
   columns: [
       {
           name: "id",
           type: "int",
           isPrimary: true
       }, {
           name: "version_id",
           isNullable: true,
           type: "int"
       }, {
           name: "name",
           type: "varchar",
           isNullable: true
       }, {
           name: "is_multiple",
           isNullable: true,
           type: "boolean"
       }, {
           name: "max",
           type: "int",
           isNullable: true
       }
   ]
});

const MAGIC_ITEMS_TABLE: Table = new Table({
    name: "magic_items",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "name",
            type: "varchar",
            isNullable: true
        }, {
            name: "description",
            type: "varchar",
            isNullable: true
        }, {
            name: "magic_item_category_id",
            isNullable: true,
            type: "int"
        }, {
            name: "is_multiple",
            isNullable: true,
            type: "boolean"
        }, {
            name: "max",
            isNullable: true,
            type: "int"
        }, {
            name: "is_dominant",
            isNullable: true,
            type: "boolean"
        }, {
            name: "version_id",
            isNullable: true,
            type: "int"
        }, {
            name: "value_points",
            isNullable: true,
            type: "float"
        }, {
            name: "foot_only",
            isNullable: true,
            type: "boolean"
        }, {
            name: "disable_magic_path_limit",
            isNullable: true,
            type: "boolean"
        }, {
            name: "wizard_only",
            type: "varchar",
            isNullable: true,
            isArray: true
        },  {
            name: "required_organisation_ids",
            type: "int",
            isNullable: true,
            isArray: true
        }
    ]
});

const MAGIC_ITEMS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["magic_item_category_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "magic_item_categories",
        onDelete: "CASCADE"
    })
];

const MAGIC_STANDARDS_TABLE: Table = new Table({
    name: "magic_standards",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "version_id",
            isNullable: true,
            type: "int"
        }, {
            name: "name",
            isNullable: true,
            type: "varchar"
        }, {
            name: "description",
            type: "varchar",
            isNullable: true
        }, {
            name: "is_multiple",
            isNullable: true,
            type: "boolean"
        }, {
            name: "infos",
            type: "varchar",
            isNullable: true
        }, {
            name: "value_points",
            isNullable: true,
            type: "float"
        }, {
            name: "max",
            isNullable: true,
            type: "int"
        }, {
            name: "availabilities",
            type: "varchar",
            isNullable: true,
            isArray: true
        }
    ]
});

const SPECIAL_RULES_TABLE: Table = new Table({
    name: "special_rules",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "version_id",
            isNullable: true,
            type: "int"
        }, {
            name: "name",
            isNullable: true,
            type: "varchar"
        }, {
            name: "description",
            type: "varchar",
            isNullable: true
        }, {
            name: "type_lvl",
            isNullable: true,
            type: "varchar"
        }
    ]
});

const UNITS_TABLE: Table = new Table({
    name: "units",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "name",
            isNullable: true,
            type: "varchar"
        }, {
            name: "unit_category_id",
            isNullable: true,
            type: "int"
        }, {
            name: "principal_organisation_id",
            isNullable: true,
            type: "int"
        }, {
            name: "min_size",
            isNullable: true,
            type: "int"
        }, {
            name: "max_size",
            isNullable: true,
            type: "int"
        }, {
            name: "can_be_general_and_bsb",
            isNullable: true,
            type: "boolean"
        }, {
            name: "position",
            isNullable: true,
            type: "int"
        }, {
            name: "magic",
            type: "varchar",
            isNullable: true
        }, {
            name: "notes",
            type: "varchar",
            isNullable: true
        }, {
            name: "is_mount",
            isNullable: true,
            type: "boolean"
        }, {
            name: "unit_type_id",
            isNullable: true,
            type: "int"
        }, {
            name: "army_organisation_id",
            type: "int",
            isNullable: true
        }, {
            name: "value_points",
            isNullable: true,
            type: "float"
        }, {
            name: "add_value_points",
            type: "int",
            isNullable: true
        }, {
            name: "characteristics",
            isNullable: true,
            type: "json"
        }, {
            name: "troop_ids",
            type: "int",
            isArray: true
        }, {
            name: "special_rule_unit_troop_ids",
            type: "int",
            isArray: true
        }, {
            name: "equipment_unit_troop_ids",
            type: "int",
            isArray: true
        }, {
            name: "unit_option_ids",
            type: "int",
            isArray: true
        }
    ]
});

const TROOPS_TABLE: Table = new Table({
    name: "troops",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "name",
            type: "varchar",
            isNullable: true
        }, {
            name: "characteristics",
            isNullable: true,
            type: "json"
        }
    ]
});

const SPECIAL_RULE_UNIT_TROOP_TABLE: Table = new Table({
    name: "special_rule_unit_troops",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "unit_id",
            isNullable: true,
            type: "int"
        }, {
            name: "troop_id",
            type: "int",
            isNullable: true
        }, {
            name: "info",
            type: "varchar",
            isNullable: true
        }, {
            name: "special_rule_id",
            isNullable: true,
            type: "int"
        }, {
            name: "type_lvl",
            isNullable: true,
            type: "varchar"
        }, {
            name: "name",
            isNullable: true,
            type: "varchar"
        }
    ]
});

const EQUIPMENT_UNIT_TROOPS_TABLE: Table = new Table({
    name: "equipment_unit_troops",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "unit_id",
            isNullable: true,
            type: "int"
        }, {
            name: "troop_id",
            type: "int",
            isNullable: true
        }, {
            name: "info",
            type: "varchar",
            isNullable: true
        }, {
            name: "equipment_id",
            isNullable: true,
            type: "int"
        }, {
            name: "type_lvl",
            isNullable: true,
            type: "varchar"
        }, {
            name: "name",
            isNullable: true,
            type: "varchar"
        }
    ]
});

const UNIT_OPTIONS_TABLE: Table = new Table({
    name: "unit_options",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "unit_id",
            isNullable: true,
            type: "int"
        }, {
            name: "parent_id",
            type: "int",
            isNullable: true
        }, {
            name: "category",
            isNullable: true,
            type: "varchar"
        }, {
            name: "magic_item_factor",
            isNullable: true,
            type: "int"
        }, {
            name: "army_organisation_activator_id",
            type: "int",
            isNullable: true
        }, {
            name: "army_organisation_desactivator_id",
            type: "int",
            isNullable: true
        }, {
            name: "use_all_activators",
            isNullable: true,
            type: "boolean"
        }, {
            name: "army_organisation_id",
            type: "int",
            isNullable: true
        }, {
            name: "is_per_model",
            isNullable: true,
            type: "boolean"
        }, {
            name: "is_foot_only",
            isNullable: true,
            type: "boolean"
        }, {
            name: "mount_id",
            type: "int",
            isNullable: true
        }, {
            name: "mount_and_characteristics_points",
            isNullable: true,
            type: "boolean"
        }, {
            name: "organisation_mode",
            isNullable: true,
            type: "varchar"
        }, {
            name: "is_multiple",
            isNullable: true,
            type: "boolean"
        }, {
            name: "is_required",
            isNullable: true,
            type: "boolean"
        }, {
            name: "domain_magic_id",
            type: "int",
            isNullable: true
        }, {
            name: "magic_item_source",
            isNullable: true,
            type: "varchar"
        }, {
            name: "organisation_id",
            type: "int",
            isNullable: true
        }, {
            name: "name",
            type: "varchar",
            isNullable: true
        }, {
            name: "value_points",
            type: "float",
            isNullable: true
        }, {
            name: "use_points",
            isNullable: true,
            type: "varchar"
        }, {
            name: "max",
            type: "int",
            isNullable: true
        }, {
            name: "has_choices",
            type: "boolean",
            isNullable: true
        }, {
            name: "weight",
            isNullable: true,
            type: "int"
        }, {
            name: "change_profile",
            isNullable: true,
            type: "boolean"
        }, {
            name: "base",
            type: "varchar",
            isNullable: true
        }, {
            name: "height",
            type: "varchar",
            isNullable: true
        }, {
            name: "enchantment_limit",
            isNullable: true,
            type: "int"
        }, {
            name: "unit_option_limits",
            type: "varchar",
            isNullable: true
        }, {
            name: "availabilities",
            isNullable: true,
            type: "varchar"
        }, {
            name: "magic_item_category_ids",
            type: "int",
            isArray: true
        }, {
            name: "equipment_ids",
            type: "int",
            isArray: true
        }, {
            name: "unit_option_change_special_rules",
            isNullable: true,
            type: "varchar"
        }, {
            name: "unit_option_change_equipments",
            isNullable: true,
            type: "varchar"
        }, {
            name: "unit_option_change_profiles",
            isNullable: true,
            type: "varchar"
        }
    ]
});

export class ArmiesInitialization1671123394624 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // armies
        await queryRunner.createTable(ARMIES_TABLE);
        // organisations
        await queryRunner.createTable(ARMY_ORGANISATION_TABLE);
        await queryRunner.createTable(ARMY_ORGANISATION_GROUP_TABLE);
        // magic items
        await queryRunner.createTable(MAGIC_ITEM_CATEGORIES_TABLE);
        await queryRunner.createTable(MAGIC_ITEMS_TABLE);
        // magic standards
        await queryRunner.createTable(MAGIC_STANDARDS_TABLE);
        // equipments
        await queryRunner.createTable(EQUIPMENT_CATEGORIES_TABLE);
        await queryRunner.createTable(EQUIPMENTS_TABLE);
        // special rules
        await queryRunner.createTable(SPECIAL_RULES_TABLE);
        // units
        await queryRunner.createTable(UNITS_TABLE);
        await queryRunner.createTable(TROOPS_TABLE);
        await queryRunner.createTable(SPECIAL_RULE_UNIT_TROOP_TABLE);
        await queryRunner.createTable(EQUIPMENT_UNIT_TROOPS_TABLE);
        await queryRunner.createTable(UNIT_OPTIONS_TABLE);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // units
        await queryRunner.dropTable(UNIT_OPTIONS_TABLE);
        await queryRunner.dropTable(EQUIPMENT_UNIT_TROOPS_TABLE);
        await queryRunner.dropTable(SPECIAL_RULE_UNIT_TROOP_TABLE);
        await queryRunner.dropTable(TROOPS_TABLE);
        await queryRunner.dropTable(UNITS_TABLE);
        // special rules
        await queryRunner.dropTable(SPECIAL_RULES_TABLE);
        // equipments
        await queryRunner.dropTable(EQUIPMENTS_TABLE);
        await queryRunner.dropTable(EQUIPMENT_CATEGORIES_TABLE);
        // magic standards
        await queryRunner.dropTable(MAGIC_STANDARDS_TABLE);
        // magic items
        await queryRunner.dropTable(MAGIC_ITEMS_TABLE);
        await queryRunner.dropTable(MAGIC_ITEM_CATEGORIES_TABLE);
        // organisation
        await queryRunner.dropTable(ARMY_ORGANISATION_GROUP_TABLE);
        await queryRunner.dropTable(ARMY_ORGANISATION_TABLE);
        // armies
        await queryRunner.dropTable(ARMIES_TABLE);
    }
}
