import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";

@Entity("army_list_unit_options")
export class ArmyListUnitOption {
    @PrimaryColumn()
    public id: string;

    @ManyToOne(() => ArmyListUnit, (armyListUnit: ArmyListUnit) => armyListUnit.options)
    @JoinColumn({ name: "army_list_unit_id" })
    public armyListUnit: ArmyListUnit;

    @Column({ type: "int", name: "unit_id" })
    public unitId: number;

    @Column({ type: "int", name: "option_id" })
    public optionId: number;

    @Column()
    public quantity: number;

    @Column({ name: "value_points" })
    public valuePoints: number;
}
