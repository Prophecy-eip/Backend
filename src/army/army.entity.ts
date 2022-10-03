import {Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn} from "typeorm"
import {UnitCategory} from "./unit/unit-category/unit-category.entity";
import {Rule} from "./rule/rule.entity";
import {Unit} from "./unit/unit.entity";


@Entity("armies")
export class Army {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @OneToMany(() => UnitCategory, (category) => category.army)
    @JoinColumn({name: "unit_categories", referencedColumnName: "id"})
    public units_categories: UnitCategory[]

    // @ManyToOne(() => Rule)
    // // @JoinColumn({name: "rules", referencedColumnName: "name"})
    // public rules: Rule[]
    //
    // @ManyToOne( () => Unit, (unit) => unit.army)
    // // @JoinColumn({name: "id", referencedColumnName: "id"})
    // public units: Unit[]

}