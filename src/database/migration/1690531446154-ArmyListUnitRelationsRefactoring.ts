import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

const ARMY_LIST_UNITS_TROOP_IDS_COLUMN: TableColumn = new TableColumn(
    {
        name: "troop_ids",
        type: "int",
        isArray: true,
        isNullable: true
    }
);

const ARMY_LIST_UNITS_TROOPS_TABLE: Table = new Table({
    name: "army_list_units_troops",
    columns: [
        {
            name: "army_list_unit_id",
            type: "varchar"
        }, {
            name: "troop_id",
            type: "int"
        }
    ]
});

const ARMY_LIST_UNITS_TROOPS_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["army_list_unit_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_list_units"
    }), new TableForeignKey({
        columnNames: ["troop_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "troops"
    })
];

export class ArmyListUnitRelationsRefactoring1690531446154 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // delete army list units troops column
        await queryRunner.dropColumn("army_list_units", ARMY_LIST_UNITS_TROOP_IDS_COLUMN);
        // create army list units troops table
        await queryRunner.createTable(ARMY_LIST_UNITS_TROOPS_TABLE);
        // await queryRunner.createForeignKeys(ARMY_LIST_UNITS_TROOPS_TABLE, ARMY_LIST_UNITS_TROOPS_TABLE_FOREIGN_KEYS);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // create army list units troops column
        await queryRunner.addColumn("army_list_units", ARMY_LIST_UNITS_TROOP_IDS_COLUMN);
        // drop army list units troops table
        await queryRunner.dropTable(ARMY_LIST_UNITS_TROOPS_TABLE);
    }
}
