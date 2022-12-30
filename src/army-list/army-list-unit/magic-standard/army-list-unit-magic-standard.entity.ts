import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("army_list_unit_magic_standards")
export class ArmyListUnitMagicStandard {
    @PrimaryColumn()
    public id: string;

    @Column({ name: "army_list_unit_id" })
    public armyListUnitId: string;

    @Column({ name: "magic_standard_id" })
    public magicStandardId: number;

    @Column({ name: "unit_option_id" })
    public unitOptionId: number;

    @Column()
    public quantity: number;

    @Column({ name: "value_points" })
    public valuePoints: number;
}
