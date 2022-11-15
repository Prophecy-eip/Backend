import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { JoinColumn } from "typeorm";

@Entity("army_lists")
export class ArmyList {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    public name: string;

    @Column({ type: "varchar" })
    @JoinColumn({ name: "profiles", referencedColumnName: "id" })
    public owner: string;


    @Column({ type: "varchar" })
    @JoinColumn({ name: "armies", referencedColumnName: "id"})
    public army: string;

    @Column()
    public cost: string;

    @Column({ name: "is_shared" })
    public isShared: boolean;
}
