import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("army_list_units_options")
export class ArmyListUnitOption {
    @PrimaryColumn()
    private id: string;

    @Column({ type: "varchar" })
    public unit: string;

    @Column({ type: "varchar" })
    public option: string;
}
