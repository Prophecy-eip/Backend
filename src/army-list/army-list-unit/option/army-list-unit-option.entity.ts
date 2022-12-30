import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("army_list_unit_options")
export class ArmyListUnitOption {
    @PrimaryColumn()
    public id: string;

    @Column({ name: "army_list_unit_id" })
    public armyListUnitId: string;

    @Column({ type: "int", name: "unit_id" })
    public unitId: number;

    @Column({ type: "int", name: "option_id" })
    public optionId: number;

    @Column()
    public quantity: number;

    @Column({ name: "value_points" })
    public valuePoints: number;
}
