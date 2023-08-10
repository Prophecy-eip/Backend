import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

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

/**
 * @class ArmyListUnitRelationsRefactoring1690531446154
 * @brief Army list unit troops refactoring
 *        Drops the army list units troop ids column in the army list units table after an ArmyListUnit entity's
 *        relations refactoring. Also adds a new table to join the army list units table with the army list units troops
 *        table.
 */
export class ArmyListUnitRelationsRefactoring1690531446154 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // delete army list units troops column
        await queryRunner.dropColumn("army_list_units", ARMY_LIST_UNITS_TROOP_IDS_COLUMN);
        // create army list units troops table
        await queryRunner.createTable(ARMY_LIST_UNITS_TROOPS_TABLE);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // create army list units troops column
        await queryRunner.addColumn("army_list_units", ARMY_LIST_UNITS_TROOP_IDS_COLUMN);
        // drop army list units troops table
        await queryRunner.dropTable(ARMY_LIST_UNITS_TROOPS_TABLE);
    }
}
