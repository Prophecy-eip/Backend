import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

const GAMES_TABLE: Table = new Table({
    name: "games",
    columns: [
        {
            name: "id",
            type: "varchar",
            isPrimary: true
        }, {
            name: "owner",
            type: "varchar"
        }, {
            name: "opponent",
            type: "varchar",
            isNullable: true
        }, {
            name: "owner_score",
            type: "int"
        }, {
            name: "opponent_score",
            type: "int"
        }, {
            name: "owner_army_list",
            type: "varchar",
            isNullable: true
        }, {
            name: "opponent_army_list",
            type: "varchar",
            isNullable: true
        }
    ]
});

const GAMES_TABLE_FOREIGN_KEYS: TableForeignKey[] = [
    new TableForeignKey({
        columnNames: ["owner"],
        referencedColumnNames: ["username"],
        referencedTableName: "profiles",
        onDelete: "CASCADE"
    }),
    new TableForeignKey({
        columnNames: ["opponent"],
        referencedColumnNames: ["username"],
        referencedTableName: "profiles",
        onDelete: "CASCADE"
    }),
    new TableForeignKey({
        columnNames: ["owner_army_list"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_lists"
    }),
    new TableForeignKey({
        columnNames: ["opponent_army_list"],
        referencedColumnNames: ["id"],
        referencedTableName: "army_lists"
    })
];

export class GamesInitialization1687856012071 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(GAMES_TABLE);
        await queryRunner.createForeignKeys(GAMES_TABLE, GAMES_TABLE_FOREIGN_KEYS);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(GAMES_TABLE);
    }
}
