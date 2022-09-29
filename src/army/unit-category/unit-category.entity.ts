import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {Army} from "../army.entity";
import {Unit} from "../unit/unit.entity";

@Entity("units_categories")
export class UnitCategory {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column()
    public limit: string;

    @OneToMany(() => Army, (army) => army.units_categories)
    @JoinColumn({name: "army", referencedColumnName: "id"})
    public army: Army

    @ManyToOne(() => Unit, (unit) => unit.category)
    @JoinColumn({name: "units", referencedColumnName: "id"})
    public units: Unit[]
}