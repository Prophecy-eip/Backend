import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

const PROPHECY_UNIT_TABLE: Table = new Table({
    name: "unit_prophecies",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true,
        }, {
            name: "attacking_regiment_unit_id",
            type: "varchar",
        }, {
            name: "defending_regiment_unit_id",
            type: "varchar",
        }, {
            name: "owner",
            type: "varchar",
        }, {
            name: "best_case",
            type: "json",
        }, {
            name: "mean_case",
            type: "json",
        }, {
            name: "worst_case",
            type: "json",
        }
    ]
});

const PROPHECY_UNIT_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["attacking_regiment_unit_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_list_units",
        onDelete: "CASCADE",
    }), new TableForeignKey({
        columnNames: ["defending_regiment_unit_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_list_units",
        onDelete: "CASCADE",
    }), new TableForeignKey({
        columnNames: ["owner"],
        referencedColumnNames: ["username"],
        referencedTableName: "profiles",
        onDelete: "CASCADE",
    }),
];
export class ProphecyUnitInitialization1672968324920 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // unit prophecies
        await queryRunner.createTable(PROPHECY_UNIT_TABLE);
        await queryRunner.createForeignKeys(PROPHECY_UNIT_TABLE, PROPHECY_UNIT_TABLE_FOREIGN_KEYS)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(PROPHECY_UNIT_TABLE);
    }

}
