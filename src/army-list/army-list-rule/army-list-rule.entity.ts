import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("army_lists_rules")
export class ArmyListRule {

    @PrimaryColumn()
    private id: string;

    @Column({ type: "varchar" })
    public list: string;

    @Column({ type: "varchar" })
    public rule: string;
}
