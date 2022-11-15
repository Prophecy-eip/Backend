import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("army_list_units")
export class ArmyListUnit {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ type: "varchar" })
    @JoinColumn({ name: "units", referencedColumnName: "id" })
    public unit: string

    @Column({ type: "int" })
    public number: number;

    @Column({ type: "varchar" })
    public formation: string;

    @Column({ name: "army_list", type: "varchar" })
    public armyList: string;
}
