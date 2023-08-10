import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

const ARMY_LISTS_TABLE: Table = new Table({
    name: "army_lists",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true
        }, {
            name: "name",
            type: "varchar"
        }, {
            name: "owner",
            type: "varchar"
        }, {
            name: "army_id",
            type: "int"
        }, {
            name: "value_points",
            type: "int"
        }, {
            name: "is_shared",
            type: "boolean"
        }, {
            name: "is_favourite",
            type: "boolean"
        }
    ]
});

const ARMY_LISTS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["owner"],
        referencedColumnNames: ["username"],
        referencedTableName: "profiles",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["army_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "armies",
        onDelete: "CASCADE"
    })
];

const ARMY_LIST_UNITS_TABLE: Table = new Table({
    name: "army_list_units",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true
        }, {
            name: "unit_id",
            type: "int"
        }, {
            name: "quantity",
            type: "int"
        }, {
            name: "formation",
            type: "varchar"
        }, {
            name: "army_list_id",
            type: "varchar",
            isNullable: true
        }, {
            name: "troop_ids",
            type: "int",
            isArray: true
        }
    ]
});

const ARMY_LIST_UNITS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["unit_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "units",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["army_list_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_lists",
        onDelete: "CASCADE"
    })
];

const ARMY_LIST_UNIT_MAGIC_ITEMS_TABLE: Table = new Table({
    name: "army_list_units_magic_items",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true
        }, {
            name: "army_list_unit_id",
            type: "varchar"
        }, {
            name: "unit_id",
            type: "int"
        }, {
            name: "magic_item_id",
            type: "int"
        }, {
            name: "unit_option_id",
            type: "int",
            isNullable: true
        }, {
            name: "equipment_id",
            type: "int",
            isNullable: true
        }, {
            name: "quantity",
            type: "int"
        }, {
            name: "value_points",
            type: "int"
        }
    ]
});

const ARMY_LIST_UNIT_MAGIC_ITEMS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["army_list_unit_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_list_units",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["unit_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "units",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["magic_item_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "magic_items",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["unit_option_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "unit_options",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["equipment_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "equipments",
        onDelete: "CASCADE"
    })
];

const ARMY_LIST_UNIT_MAGIC_STANDARDS_TABLE: Table = new Table({
    name: "army_list_unit_magic_standards",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true
        }, {
            name: "army_list_unit_id",
            type: "varchar"
        }, {
            name: "magic_standard_id",
            type: "int"
        }, {
            name: "unit_option_id",
            type: "int",
            isNullable: true
        }, {
            name: "quantity",
            type: "int"
        }, {
            name: "value_points",
            type: "int"
        }
    ]
});

const ARMY_LIST_UNIT_MAGIC_STANDARDS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["army_list_unit_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_list_units",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["magic_standard_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "magic_standards",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["unit_option_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "unit_options",
        onDelete: "CASCADE"
    })
];

const ARMY_LIST_UNIT_OPTIONS_TABLE: Table = new Table({
    name: "army_list_unit_options",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true
        }, {
            name: "army_list_unit_id",
            type: "varchar"
        }, {
            name: "unit_id",
            type: "int"
        }, {
            name: "option_id",
            type: "int"
        }, {
            name: "quantity",
            type: "int"
        }, {
            name: "value_points",
            type: "int"
        }
    ]
});

const ARMY_LIST_UNIT_OPTIONS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["army_list_unit_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_list_units",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["unit_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "units",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["option_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "unit_options",
        onDelete: "CASCADE"
    })
];

const ARMY_LIST_UNIT_TROOP_EQUIPMENTS_TABLE: Table = new Table({
    name: "army_list_unit_troop_equipments",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true
        }, {
            name: "army_list_unit_id",
            type: "varchar"
        }, {
            name: "troop_id",
            type: "int"
        }, {
            name: "equipment_id",
            type: "int"
        }
    ]
});

const ARMY_LIST_UNIT_TROOP_EQUIPMENTS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["army_list_unit_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_list_units",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["troop_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "troops",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["equipment_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "equipments",
        onDelete: "CASCADE"
    })
];

const ARMY_LIST_UNIT_TROOP_SPECIAL_RULES_TABLE: Table = new Table({
    name: "army_list_unit_troop_special_rules",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true
        }, {
            name: "army_list_unit_id",
            type: "varchar"
        }, {
            name: "troop_id",
            type: "int"
        }, {
            name: "special_rule_id",
            type: "int"
        }
    ]
});

const ARMY_LIST_UNIT_TROOP_SPECIAL_RULES_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["army_list_unit_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_list_units",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["troop_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "troops",
        onDelete: "CASCADE"
    }), new TableForeignKey({
        columnNames: ["special_rule_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "special_rules",
        onDelete: "CASCADE"
    })
];

/**
 * @class ArmyListsInitialization1672323186772
 * @brief Initialization of the army lists (and related) tables.
 *        Creation of the army lists, army list units, army list unit magic items, army list units magic standards,
 *        army list unit options, army list unit troop equipment and army list uint troop special rules tables and
 *        relations in the database.
 */
export class ArmyListsInitialization1672323186772 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // army lists
        await queryRunner.createTable(ARMY_LISTS_TABLE);
        await queryRunner.createForeignKeys(ARMY_LISTS_TABLE, ARMY_LISTS_TABLE_FOREIGN_KEYS);
        // units
        await queryRunner.createTable(ARMY_LIST_UNITS_TABLE);
        await queryRunner.createForeignKeys(ARMY_LIST_UNITS_TABLE, ARMY_LIST_UNITS_TABLE_FOREIGN_KEYS);
        // unit magic items
        await queryRunner.createTable(ARMY_LIST_UNIT_MAGIC_ITEMS_TABLE);
        await queryRunner.createForeignKeys(ARMY_LIST_UNIT_MAGIC_ITEMS_TABLE, ARMY_LIST_UNIT_MAGIC_ITEMS_TABLE_FOREIGN_KEYS);
        // unit magic standard
        await queryRunner.createTable(ARMY_LIST_UNIT_MAGIC_STANDARDS_TABLE);
        await queryRunner.createForeignKeys(ARMY_LIST_UNIT_MAGIC_STANDARDS_TABLE, ARMY_LIST_UNIT_MAGIC_STANDARDS_TABLE_FOREIGN_KEYS);
        // unit options
        await queryRunner.createTable(ARMY_LIST_UNIT_OPTIONS_TABLE);
        await queryRunner.createForeignKeys(ARMY_LIST_UNIT_OPTIONS_TABLE, ARMY_LIST_UNIT_OPTIONS_TABLE_FOREIGN_KEYS);
        // unit troop equipments
        await queryRunner.createTable(ARMY_LIST_UNIT_TROOP_EQUIPMENTS_TABLE);
        await queryRunner.createForeignKeys(ARMY_LIST_UNIT_TROOP_EQUIPMENTS_TABLE, ARMY_LIST_UNIT_TROOP_EQUIPMENTS_TABLE_FOREIGN_KEYS);
        // unit troop special rules
        await queryRunner.createTable(ARMY_LIST_UNIT_TROOP_SPECIAL_RULES_TABLE);
        await queryRunner.createForeignKeys(ARMY_LIST_UNIT_TROOP_SPECIAL_RULES_TABLE, ARMY_LIST_UNIT_TROOP_SPECIAL_RULES_TABLE_FOREIGN_KEYS);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // unit troop special rules
        await queryRunner.dropTable(ARMY_LIST_UNIT_TROOP_SPECIAL_RULES_TABLE);
        // unit troop equipments
        await queryRunner.dropTable(ARMY_LIST_UNIT_TROOP_EQUIPMENTS_TABLE);
        // unit options
        await queryRunner.dropTable(ARMY_LIST_UNIT_OPTIONS_TABLE);
        // unit magic standards
        await queryRunner.dropTable(ARMY_LIST_UNIT_MAGIC_STANDARDS_TABLE);
        // unit magic items
        await queryRunner.dropTable(ARMY_LIST_UNIT_MAGIC_ITEMS_TABLE);
        // units
        await queryRunner.dropTable(ARMY_LIST_UNITS_TABLE);
        // army lists
        await queryRunner.dropTable(ARMY_LISTS_TABLE);
    }
}
