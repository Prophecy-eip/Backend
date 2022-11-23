import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

const PROFILES_TABLES: Table = new Table({
    name: "profiles",
    columns: [
        {
            name: "username",
            type: "varchar",
            isPrimary: true,
            isNullable: false,
            isUnique: true,
        }, {
            name: "email",
            type: "varchar",
            isNullable: false,
            isUnique: true,
        }, {
            name: "password",
            type: "varchar",
            isNullable: false,
        }, {
            name: "is_email_verified",
            type: "boolean",
            default: false,
            isNullable: false,
        }, {
            name: "profile_picture_path",
            type: "varchar",
            isNullable: true,
            default: null
        }, {
            name: "account_type",
            type: "varchar",
            isNullable: false,
        },
    ]
});

const MODIFIERS_TABLE: Table = new Table({
    name: "modifiers",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isNullable: false,
            isUnique: true,
        }, {
            name: "type",
            type: "varchar"
        }, {
            name: "value",
            type: "varchar"
        }, {
            name: "field",
            type: "varchar"
        }, {
            name: "limits",
            type: "varchar",
        }
    ]
});

const OPTIONS_TABLE: Table = new Table({
    name: "options",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            isNullable: false,
        }, {
            name: "name",
            type: "varchar",
            isNullable: false,
        }, {
            name: "type",
            type: "varchar",
        }, {
            name: "limits",
            type: "varchar",
        }, {
            name: "cost",
            type: "varchar",
        }, {
            name: "modifiers",
            type: "varchar",
        }, {
            name: "rules",
            type: "varchar",
        }
    ],
});

const RULES_TABLE: Table = new Table({
    name: "rules",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            isNullable: false,
        }, {
            name: "name",
            type: "varchar",
            isNullable: false,
        }, {
            name: "description",
            type: "varchar",
            isNullable: false,
        }
    ]
});

const SPECIAL_ITEM_CATEGORIES_TABLE: Table = new Table({
    name: "special_item_categories",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            isNullable: false,
        }, {
            name: "name",
            type: "varchar",
        }, {
            name: "is_collective",
            type: "boolean",
        }, {
            name: "limits",
            type: "varchar",
        }, {
            name: "items",
            type: "varchar",
        }
    ]
});

const SPECIAL_ITEMS_TABLE: Table = new Table({
    name: "special_items",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            isNullable: false,
        }, {
            name: "name",
            type: "varchar",
        }, {
            name: "is_collective",
            type: "boolean",
        }, {
            name: "type",
            type: "varchar",
        }, {
            name: "limits",
            type: "varchar",
        }, {
            name: "cost",
            type: "varchar",
        }, {
            name: "category",
            type: "varchar",
        }
    ]
});

const UNIT_CATEGORIES_TABLE: Table = new Table({
    name: "unit_categories",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            isNullable: false,
        }, {
            name: "name",
            type: "varchar",
        }, {
            name: "limits",
            type: "varchar",
        }, {
            name: "target_id",
            type: "varchar",
        }
    ]
});

const UNIT_PROFILES_TABLE: Table = new Table({
    name: "unit_profiles",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            isNullable: false
        }, {
            name: "name",
            type: "varchar",
        }, {
            name: "characteristics",
            type: "varchar",
        }, {
            name: "is_shared",
            type: "varchar",
        }
    ]
});

const UNITS_TABLE: Table = new Table({
    name: "units",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            isNullable: false,
        }, {
            name: "name",
            type: "varchar",
        }, {
            name: "category",
            type: "varchar",
        }, {
            name: "cost",
            type: "varchar",
        }, {
            name: "options",
            type: "varchar",
        }, {
            name: "profiles",
            type: "varchar",
        }
    ]
});

const UPGRADE_CATEGORIES_TABLE: Table = new Table({
   name: "upgrade_categories",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            isNullable: false,
        }, {
            name: "name",
            type: "varchar",
        }, {
            name: "is_collective",
            type: "boolean",
        }, {
            name: "limits",
            type: "varchar",
            isArray: true
        }
    ]
});

const UPGRADES_TABLE: Table = new Table({
    name: "upgrades",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            isNullable: false,
        }, {
            name: "name",
            type: "varchar",
        }, {
            name: "is_collective",
            type: "boolean",
        }, {
            name: "limits",
            type: "varchar",
        }, {
            name: "cost",
            type: "varchar",
        }, {
            name: "modifiers",
            type: "varchar",
        }, {
            name: "profiles",
            type: "varchar",
        }, {
            name: "rules",
            type: "varchar",
        }
    ]
});

const ARMIES_TABLE: Table = new Table({
    name: "armies",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            isNullable: false,
        }, {
            name: "name",
            type: "varchar"
        }, {
            name: "unit_categories",
            type: "varchar"
        }, {
            name: "rules",
            type: "varchar"
        }, {
            name: "upgrade_categories",
            type: "varchar"
        }, {
            name: "special_item_categories",
            type: "varchar"
        }, {
            name: "units",
            type: "varchar"
        }, {
            name: "upgrades",
            type: "varchar"
        }, {
            name: "items",
            type: "varchar"
        },
    ]
});

const ARMY_LIST_UNITS_TABLE: Table = new Table({
    name: "army_list_units",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            isNullable: false,
        }, {
            name: "unit",
            type: "varchar",
        }, {
            name: "number",
            type: "int",
            default: 1,
            isNullable: false
        }, {
            name: "formation",
            type: "varchar",
            isNullable: false,
        }, {
            name: "army_list",
            type: "varchar",
            isNullable: true
        }
    ],
});

const ARMY_LIST_UNITS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["unit"],
        referencedColumnNames: ["id"],
        referencedTableName: "units",
        onDelete: "CASCADE",
    }), new TableForeignKey(({
        columnNames: ["army_list"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_lists",
        onDelete: "CASCADE",
    }))
];

const ARMY_LIST_UNITS_OPTIONS_TABLE: Table = new Table({
    name: "army_list_units_options",
    columns: [
        {
           name: "id",
           type: "varchar",
           isPrimary: true,
        }, {
            name: "unit",
            type: "varchar",
            isNullable: false,
            isUnique: false
        }, {
            name: "option",
            type: "varchar",
            isNullable: false,
            isUnique: false,
        }
    ]
});

const ARMY_LIST_UNITS_OPTIONS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["unit"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_list_units",
        onDelete: "CASCADE",
    }), new TableForeignKey({
        columnNames: ["option"],
        referencedColumnNames: ["id"],
        referencedTableName: "options",
        onDelete: "CASCADE",
    })
];


const ARMY_LIST_UNITS_UPGRADES_TABLE: Table = new Table({
    name: "army_list_units_upgrades",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true
        }, {
            name: "unit",
            type: "varchar",
            isNullable: false,
            isUnique: false
        }, {
            name: "upgrade",
            type: "varchar",
            isNullable: false,
            isUnique: false,
        }
    ]
});

const ARMY_LIST_UNITS_UPGRADES_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["unit"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_list_units",
        onDelete: "CASCADE",
    }), new TableForeignKey({
        columnNames: ["upgrade"],
        referencedColumnNames: ["id"],
        referencedTableName: "upgrades",
        onDelete: "CASCADE",
    })
];

const ARMY_LISTS_TABLE: Table = new Table({
    name: "army_lists",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            isNullable: false,
        }, {
            name: "name",
            type: "varchar",
            isNullable: false,
        }, {
            name: "army",
            type: "varchar",
            isNullable: false,
        }, {
            name: "cost",
            type: "varchar",
            isNullable: false,
        }, {
            name: "is_shared",
            type: "boolean",
            isNullable: false,
        }, {
            name: "owner",
            type: "varchar",
            isNullable: false
        }
    ]
});

const ARMY_LIST_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["army"],
        referencedColumnNames: ["id"],
        referencedTableName: "armies",
        onDelete: "CASCADE",
    }),
];

const ARMY_LIST_UPGRADES_TABLE: Table = new Table({
    name: "army_lists_upgrades",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
        }, {
            name: "list",
            type: "varchar",
            isNullable: false,
            isUnique: false,
        }, {
            name: "upgrade",
            type: "varchar",
            isNullable: false,
            isUnique: false
        }
    ]
});

const ARMY_LIST_UPGRADES_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["list"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_lists",
        onDelete: "CASCADE",
    }), new TableForeignKey({
        columnNames: ["upgrade"],
        referencedColumnNames: ["id"],
        referencedTableName: "upgrades",
        onDelete: "CASCADE",
    }),
];

const ARMY_LIST_RULES_TABLE: Table = new Table({
    name: "army_lists_rules",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
        }, {
            name: "list",
            type: "varchar",
            isNullable: false,
            isUnique: false,
        }, {
            name: "rule",
            type: "varchar",
            isNullable: false,
            isUnique: false
        }
    ],

});

const ARMY_LIST_RULES_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["list"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_lists",
        onDelete: "CASCADE",
    }), new TableForeignKey({
        columnNames: ["rule"],
        referencedColumnNames: ["id"],
        referencedTableName: "rules",
        onDelete: "CASCADE"
    }),
];


export class Initialization1667924495954 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // users
        await queryRunner.createTable(PROFILES_TABLES, true);
        // armies
        await queryRunner.createTable(MODIFIERS_TABLE, true);
        await queryRunner.createTable(OPTIONS_TABLE, true);
        await queryRunner.createTable(RULES_TABLE, true);
        await queryRunner.createTable(SPECIAL_ITEM_CATEGORIES_TABLE, true);
        await queryRunner.createTable(SPECIAL_ITEMS_TABLE, true);
        await queryRunner.createTable(UNIT_CATEGORIES_TABLE, true);
        await queryRunner.createTable(UNIT_PROFILES_TABLE, true);
        await queryRunner.createTable(UNITS_TABLE, true);
        await queryRunner.createTable(UPGRADE_CATEGORIES_TABLE, true);
        await queryRunner.createTable(UPGRADES_TABLE, true);
        await queryRunner.createTable(ARMIES_TABLE, true);
        // army lists
        await queryRunner.createTable(ARMY_LISTS_TABLE, true);
        await queryRunner.createTable(ARMY_LIST_UNITS_TABLE, true);
        await queryRunner.createForeignKeys(ARMY_LIST_UNITS_TABLE, ARMY_LIST_UNITS_TABLE_FOREIGN_KEYS);
        await queryRunner.createTable(ARMY_LIST_UNITS_OPTIONS_TABLE, true);
        await queryRunner.createForeignKeys(ARMY_LIST_UNITS_OPTIONS_TABLE, ARMY_LIST_UNITS_OPTIONS_TABLE_FOREIGN_KEYS);
        await queryRunner.createTable(ARMY_LIST_UNITS_UPGRADES_TABLE, true);
        await queryRunner.createForeignKeys(ARMY_LIST_UNITS_UPGRADES_TABLE, ARMY_LIST_UNITS_UPGRADES_TABLE_FOREIGN_KEYS);
        await queryRunner.createForeignKeys(ARMY_LISTS_TABLE, ARMY_LIST_TABLE_FOREIGN_KEYS);
        await queryRunner.createTable(ARMY_LIST_RULES_TABLE, true);
        await queryRunner.createTable(ARMY_LIST_UPGRADES_TABLE, true);
        await queryRunner.createForeignKeys(ARMY_LIST_RULES_TABLE, ARMY_LIST_RULES_TABLE_FOREIGN_KEYS);
        await queryRunner.createForeignKeys(ARMY_LIST_UPGRADES_TABLE, ARMY_LIST_UPGRADES_TABLE_FOREIGN_KEYS);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // army lists
        await queryRunner.dropTable(ARMY_LIST_UPGRADES_TABLE, true);
        await queryRunner.dropTable(ARMY_LIST_RULES_TABLE, true);
        await queryRunner.dropTable(ARMY_LIST_UNITS_OPTIONS_TABLE, true);
        await queryRunner.dropTable(ARMY_LIST_UNITS_UPGRADES_TABLE, true);
        await queryRunner.dropTable(ARMY_LIST_UNITS_TABLE, true, true, );
        await queryRunner.dropTable(ARMY_LISTS_TABLE, true, false);

        // armies
        await queryRunner.dropTable(MODIFIERS_TABLE, true);
        await queryRunner.dropTable(OPTIONS_TABLE, true);
        await queryRunner.dropTable(SPECIAL_ITEM_CATEGORIES_TABLE, true);
        await queryRunner.dropTable(SPECIAL_ITEMS_TABLE, true);
        await queryRunner.dropTable(UNIT_CATEGORIES_TABLE, true);
        await queryRunner.dropTable(UNIT_PROFILES_TABLE, true);
        await queryRunner.dropTable(UNITS_TABLE, true);
        await queryRunner.dropTable(UPGRADE_CATEGORIES_TABLE, true);
        await queryRunner.dropTable(UPGRADES_TABLE, true);
        await queryRunner.dropTable(ARMIES_TABLE, true);
        // users
        await queryRunner.dropTable(PROFILES_TABLES, true);
    }
}
