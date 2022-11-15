import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Army } from "../army/army.entity";
import { JoinColumn } from "typeorm";
import { Profile } from "../account/profile/profile.entity";
import { ArmyListUnit } from "./army-list-unit/army-list-unit.entity";
import { Upgrade } from "../army/upgrade/upgrade.entity";
import { Rule } from "../army/rule/rule.entity";


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

    // @Column({ type: "varchar" })
    // @ManyToOne(type => ArmyListUnit, (unit) => unit.list)
    // @JoinColumn({ name: "army_list_units", referencedColumnName: "id"})
    // public units: ArmyListUnit[];
    //
    // @Column({ type: "varchar" })
    // @JoinColumn({ name: "upgrades", referencedColumnName: "id" })
    // public upgrades: Upgrade[];

    // @Column({ type: "varchar" })
    // @JoinColumn({ name: "rules", referencedColumnName: "id" })
    // public rules: Rule[];

    @Column({ name: "is_shared" })
    public isShared: boolean;
}
