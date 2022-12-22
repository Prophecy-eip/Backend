import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"
import { stringify } from "ts-jest";

const ARMIES_TABLE: Table = new Table({
    name: "armies",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true,
        }, {
            name: "name",
            type: "varchar",
            isNullable: false,
        }, {
            name: "version_id",
            type: "int",
        }, {
            name: "category_id",
            type: "int",
        }, {
            name: "source",
            type: "varchar",
        }, {
            name: "equipment_limits",
            type: "varchar",
        }, {
            name: "special_rule_limits",
            type: "varchar",
        }, {
            name: "organisation_ids",
            type: "int",
            isArray: true,
            isNullable: true,
        }, {
            name: "magic_item_category_ids",
            type: "int",
            isArray: true,
            isNullable: true,
        }, {
            name: "magic_item_ids",
            type: "int",
            isArray: true,
            isNullable: true,
        }, {
            name: "magic_standard_ids",
            type: "int",
            isArray: true,
            isNullable: true,
        }, {
            name: "equipment_ids",
            type: "int",
            isArray: true,
            isNullable: true,
        }, {
            name: "rule_ids",
            type: "int",
            isArray: true,
            isNullable: true,
        }, {
            name: "unit_ids",
            type: "int",
            isArray: true,
            isNullable: true,
        }
    ]
});

const EQUIPMENT_CATEGORIES_TABLE: Table = new Table({
    name: "equipment_categories",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true,
        }, {
            name: "version_id",
            type: "int",
        }, {
            name: "name",
            type: "varchar",
        },
        // {
        //     name: "army_id",
        //     type: "int",
        // }
    ]
});

// const EQUIPMENT_CATEGORIES_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
//     new TableForeignKey({
//         columnNames: ["army_id"],
//         referencedColumnNames: ["id"],
//         referencedTableName: "armies",
//         onDelete: "CASCADE"
//     }),
// ];

const EQUIPMENTS_TABLE: Table = new Table({
    name: "equipments",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        },
        // {
        //     name: "army_id",
        //     type: "int",
        // },
        {
            name: "version_id",
            type: "int",
        }, {
            name: "name",
            type: "varchar",
        }, {
            name: "description",
            type: "varchar",
            isNullable: true,
        }, {
            name: "type_lvl",
            type: "varchar",
        }, {
            name: "can_be_enchanted",
            type: "boolean",
        }, {
            name: "equipment_categories",
            type: "int",
            isArray: true,
        }
    ]
});

// const EQUIPMENTS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
//     new TableForeignKey({
//         columnNames: ["army_id"],
//         referencedColumnNames: ["id"],
//         referencedTableName: "armies",
//         onDelete: "CASCADE"
//     }),
// ];

const ARMY_ORGANISATION_TABLE: Table = new Table({
    name: "army_organisations",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true,
        }, {
            name: "name",
            type: "varchar",
            isNullable: false
        }, {
            name: "description",
            type: "varchar",
            isNullable: true
        }, {
            name: "is_default",
            type: "boolean",
        }, {
            name: "organisation_group_ids",
            type: "int",
            isArray: true,
        }
    ]
});

// const ARMY_ORGANISATION_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
//     new TableForeignKey({
//         columnNames: ["army_id"],
//         referencedColumnNames: ["id"],
//         referencedTableName: "armies",
//         onDelete: "CASCADE"
//     }),
// ];

const ARMY_ORGANISATION_GROUP_TABLE: Table = new Table({
    name: "army_organisation_groups",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true,
        }, {
            name: "army_organisation_id",
            type: "int",
            isNullable: false,
        }, {
            name: "name",
            type: "varchar",
            isNullable: false
        }, {
            name: "organisation_group_limits",
            type: "varchar",
            isNullable: true,
        }, {
            name: "organisation_unit_limits",
            type: "varchar",
            isNullable: true,
        }, {
            name: "change_item_limits",
            type: "varchar",
            isNullable: true,
        },
    ]
});

const ARMY_ORGANISATION_GROUP_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["army_organisation_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_organisations",
        onDelete: "CASCADE"
    }),
];

const MAGIC_ITEM_CATEGORIES_TABLE: Table = new Table({
   name: "magic_item_categories",
   columns: [
       {
           name: "id",
           type: "int",
           isPrimary: true,
       }, {
           name: "version_id",
           type: "int",
       }, {
           name: "name",
           type: "varchar",
           isNullable: false,
       }, {
           name: "is_multiple",
           type: "boolean",
       }, {
           name: "max",
           type: "int",
           isNullable: true
       },
   ]
});

const MAGIC_ITEMS_TABLE: Table = new Table({
    name: "magic_items",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true,
        }, {
            name: "name",
            type: "varchar",
            isNullable: false,
        }, {
            name: "description",
            type: "varchar",
            isNullable: true
        }, {
            name: "magic_item_category_id",
            type: "int",
        },/* {
            name: "army_id",
            type: "int",
        }, */{
            name: "is_multiple",
            type: "boolean",
        }, {
            name: "max",
            type: "int",
        }, {
            name: "is_dominant",
            type: "boolean",
        }, {
            name: "version_id",
            type: "int",
        }, {
            name: "value_points",
            type: "int",
        }, {
            name: "foot_only",
            type: "boolean",
        }, {
            name: "disable_magic_path_limit",
            type: "boolean",
        }, {
            name: "wizard_only",
            type: "varchar",
            isArray: true,
        },  {
            name: "required_organisation_ids",
            type: "int",
            isArray: true,
        },
    ]
});

const MAGIC_ITEMS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["magic_item_category_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "magic_item_categories",
        onDelete: "CASCADE"
    }), /* new TableForeignKey({
        columnNames: ["army_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "armies",
        onDelete: "CASCADE"
    }),*/
];

const MAGIC_STANDARDS_TABLE: Table = new Table({
    name: "magic_standards",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true,
        }, {
            name: "version_id",
            type: "int"
        },/* {
            name: "army_id",
            type: "int"
        },*/ {
            name: "name",
            type: "varchar"
        }, {
            name: "description",
            type: "varchar",
            isNullable: true,
        }, {
            name: "is_multiple",
            type: "boolean"
        }, {
            name: "infos",
            type: "varchar",
            isNullable: true,
        }, {
            name: "value_points",
            type: "int"
        }, {
            name: "max",
            type: "int"
        }, {
            name: "availabilities",
            type: "varchar",
            isArray: true,
        }
    ]
});

// const MAGIC_STANDARDS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
//    new TableForeignKey({
//         columnNames: ["army_id"],
//         referencedColumnNames: ["id"],
//         referencedTableName: "armies",
//         onDelete: "CASCADE"
//     }),
// ];

const SPECIAL_RULES_TABLE: Table = new Table({
    name: "special_rules",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        },
        // {
        //     name: "army_id",
        //     type: "int"
        // },
        {
            name: "version_id",
            type: "int"
        }, {
            name: "name",
            type: "varchar"
        }, {
            name: "description",
            type: "varchar",
            isNullable: true,
        }, {
            name: "type_lvl",
            type: "varchar"
        }
    ]
});

// const SPECIAL_RULES_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
//     new TableForeignKey({
//         columnNames: ["army_id"],
//         referencedColumnNames: ["id"],
//         referencedTableName: "armies",
//         onDelete: "CASCADE"
//     }),
// ];

const UNITS_TABLE: Table = new Table({
    name: "units",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true
        }, {
            name: "name",
            type: "varchar"
        },
        // {
        //     name: "army_id",
        //     type: "int"
        // },
        {
            name: "unit_category_id",
            type: "int"
        }, {
            name: "principal_organisation_id",
            type: "int"
        }, {
            name: "min_size",
            type: "int"
        }, {
            name: "max_size",
            type: "int"
        }, {
            name: "can_be_general_and_bsb",
            type: "boolean"
        }, {
            name: "position",
            type: "int"
        }, {
            name: "magic",
            type: "varchar",
            isNullable: true,
        }, {
            name: "notes",
            type: "varchar",
            isNullable: true,
        }, {
            name: "is_mount",
            type: "boolean"
        }, {
            name: "unit_type_id",
            type: "int"
        }, {
            name: "army_organisation_id",
            type: "int",
            isNullable: true,
        }, {
            name: "value_points",
            type: "int"
        }, {
            name: "add_value_points",
            type: "int",
            isNullable: true,
        }, {
            name: "characteristics",
            type: "varchar"
        }, {
            name: "troop_ids",
            type: "int",
            isArray: true,
        }, {
            name: "special_rule_unit_troop_ids",
            type: "int",
            isArray: true,
        }, {
            name: "equipment_unit_troop_ids",
            type: "int",
            isArray: true,
        }, {
            name: "unit_option_ids",
            type: "int",
            isArray: true,
        }
    ]
});

const TROOPS_TABLE: Table = new Table({
    name: "troops",
    columns: [
        {
            name: "id",
            type: "int",
            isPrimary: true,
        }, {
            name: "name",
            type: "varchar"
        }, {
            name: "characteristics",
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
        // await queryRunner.createForeignKeys(ARMY_ORGANISATION_TABLE, ARMY_ORGANISATION_TABLE_FOREIGN_KEYS)
        await queryRunner.createTable(ARMY_ORGANISATION_GROUP_TABLE);
        await queryRunner.createForeignKeys(ARMY_ORGANISATION_GROUP_TABLE, ARMY_ORGANISATION_GROUP_TABLE_FOREIGN_KEYS);
        // magic items
        await queryRunner.createTable(MAGIC_ITEM_CATEGORIES_TABLE);
        // await queryRunner.createForeignKeys(MAGIC_ITEM_CATEGORIES_TABLE, MAGIC_ITEM_CATEGORIES_TABLE_FOREIGN_KEYS)
        await queryRunner.createTable(MAGIC_ITEMS_TABLE);
        await queryRunner.createForeignKeys(MAGIC_ITEMS_TABLE, MAGIC_ITEMS_TABLE_FOREIGN_KEYS);
        // magic standards
        await queryRunner.createTable(MAGIC_STANDARDS_TABLE);
        // await queryRunner.createForeignKeys(MAGIC_STANDARDS_TABLE, MAGIC_STANDARDS_TABLE_FOREIGN_KEYS);
        // equipments
        await queryRunner.createTable(EQUIPMENT_CATEGORIES_TABLE);
        // await queryRunner.createForeignKeys(EQUIPMENT_CATEGORIES_TABLE, EQUIPMENT_CATEGORIES_TABLE_FOREIGN_KEYS);
        await queryRunner.createTable(EQUIPMENTS_TABLE);
        // await queryRunner.createForeignKeys(EQUIPMENTS_TABLE, EQUIPMENTS_TABLE_FOREIGN_KEYS);
        // special rules
        await queryRunner.createTable(SPECIAL_RULES_TABLE);
        // await queryRunner.createForeignKeys(SPECIAL_RULES_TABLE, SPECIAL_RULES_TABLE_FOREIGN_KEYS);
        // units
        await queryRunner.createTable(UNITS_TABLE);
        await queryRunner.createTable(TROOPS_TABLE);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // units
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
