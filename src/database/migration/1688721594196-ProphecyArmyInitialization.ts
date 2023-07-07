import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

const PROPHECY_ARMY_TABLE: Table = new Table({
    name: "army_prophecies",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true
        }, {
            name: "owner",
            type: "varchar"
        }, {
            name: "army_list_1",
            type: "varchar"
        }, {
            name: "army_list_2",
            type: "varchar"
        }, {
            name: "player_1_score",
            type: "int"
        }, {
            name: "player_2_score",
            type: "int"
        }
    ]
});

const PROPHECY_ARMY_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["owner"],
        referencedColumnNames: ["username"],
        referencedTableName: "profiles",
        onDelete: "CASCADE"
    }),
    new TableForeignKey({
        columnNames: ["army_list_1"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_lists"
    }),
    new TableForeignKey({
        columnNames: ["army_list_2"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_lists"
    })
];

export class ProphecyArmyInitialization1688721594196 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(PROPHECY_ARMY_TABLE);
        await queryRunner.createForeignKeys(PROPHECY_ARMY_TABLE, PROPHECY_ARMY_TABLE_FOREIGN_KEYS);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(PROPHECY_ARMY_TABLE);
    }

}
