import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("army_list_units_upgrades")
export class ArmyListUnitUpgrade {
    @PrimaryColumn()
    private id: string;

    @Column({ type: "varchar" })
    public unit: string;

    @Column({ type: "varchar" })
    public upgrade: string;
}
