import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {Army} from "../../army.entity";
import {Unit} from "../unit.entity";

@Entity("unit_categories")
export class UnitCategory {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({ type: "varchar" })
    public limits: string;

    @OneToMany(() => Army, (army) => army.units_categories)
    @JoinColumn({name: "army", referencedColumnName: "id"})
    @Column({ type: "varchar"})
    public army: Army

    @Column({name: "target_id"})
    public targetId: string

    // @ManyToOne(() => Unit, (unit) => unit.category)
    // // @JoinColumn({name: "units", referencedColumnName: "id"})
    // public units: Unit[]

}