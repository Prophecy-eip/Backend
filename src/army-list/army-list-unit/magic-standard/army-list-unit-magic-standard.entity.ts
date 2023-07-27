import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";

@Entity("army_list_unit_magic_standards")
export class ArmyListUnitMagicStandard {
    @PrimaryColumn()
    public id: string;

    @ManyToOne(() => ArmyListUnit, (unit: ArmyListUnit) => unit.magicStandards)
    @JoinColumn({ name: "army_list_unit_id" })
    public armyListUnit: ArmyListUnit;

    @Column({ name: "magic_standard_id" })
    public magicStandardId: number;

    @Column({ name: "unit_option_id" })
    public unitOptionId: number;

    @Column()
    public quantity: number;

    @Column({ name: "value_points" })
    public valuePoints: number;
}
