import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("army_lists_upgrades")
export class ArmyListUpgrade {
    @PrimaryColumn({ type: "varchar" })
    private id: string;

    @Column({ type: "varchar" })
    public list: string;

    @Column({ type: "varchar" })
    public upgrade: string;
}
