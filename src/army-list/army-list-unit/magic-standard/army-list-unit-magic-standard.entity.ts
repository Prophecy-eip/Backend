import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { UnitOption } from "@army/unit/option/unit-option.entity";
import { MagicStandard } from "@army/magic-standard/magic-standard.entity";

@Entity("army_list_unit_magic_standards")
export class ArmyListUnitMagicStandard {
    @PrimaryColumn()
    public id: string;

    @ManyToOne(() => ArmyListUnit, (unit: ArmyListUnit) => unit.magicStandards)
    @JoinColumn({ name: "army_list_unit_id" })
    public armyListUnit: ArmyListUnit;

    @ManyToOne(() => MagicStandard)
    @JoinColumn({ name: "magic_standard_id" })
    public magicStandard: MagicStandard;

    @ManyToOne(() => UnitOption)
    @JoinColumn({ name: "unit_option_id" })
    public unitOption: UnitOption | null;

    @Column()
    public quantity: number;

    @Column({ name: "value_points" })
    public valuePoints: number;
}
