import {Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryColumn, ManyToOne} from "typeorm";

import { Army } from "../army.entity";
import {UnitCategory} from "../unit-category/unit-category.entity";
import {UnitProfile} from "./unit-profile/unit-profile.entity";

@Entity("units")
export class Unit {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @OneToOne((type) => Army)
    @JoinColumn({name: "army", referencedColumnName: "id"})
    @Column({type: "varchar"})
    public army: Army;

    @OneToMany(() => UnitCategory, (category) => category.units)
    @JoinColumn({name: "category", referencedColumnName: "id"})
    @Column({type: "varchar"})
    public category: UnitCategory;

    @ManyToOne( () => UnitProfile)
    
}