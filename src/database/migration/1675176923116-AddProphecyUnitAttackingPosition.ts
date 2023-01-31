import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

const PROPHECY_UNIT_ATTACKING_POSITION_COLUMN: TableColumn = new TableColumn({
    name: "attacking_position",
    type: "enum",
    enum: ["front", "flank", "back"]
});

export class AddProphecyUnitAttackingPosition1675176923116 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("unit_prophecies", [PROPHECY_UNIT_ATTACKING_POSITION_COLUMN]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("unit_prophecies", PROPHECY_UNIT_ATTACKING_POSITION_COLUMN);
    }
}
