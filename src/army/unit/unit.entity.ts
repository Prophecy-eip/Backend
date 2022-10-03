import {Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryColumn, ManyToOne} from "typeorm";

import { Army } from "../army.entity";
import {UnitCategory} from "./unit-category/unit-category.entity";
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

    @OneToOne((type) => UnitCategory)
    @JoinColumn({name: "category", referencedColumnName: "id"})
    @Column({type: "varchar"})
    public category: UnitCategory;

    @Column()
    public cost: string;

    @Column()
    public options: string;

    // @ManyToOne(() => UnitProfile)
    @Column({type: "varchar", name: "profiles"})
    public profiles: UnitProfile;

    // @ManyToOne( () => UnitProfile, profile => profile.unit)
    // public profiles: UnitProfile[];
}
