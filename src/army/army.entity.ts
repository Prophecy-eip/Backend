import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm"
import { UnitCategory } from "./unit/unit-category/unit-category.entity";

@Entity("armies")
export class Army {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    // @OneToMany(() => UnitCategory, (category) => category.army)
    // @JoinColumn({name: "unit_categories", referencedColumnName: "id"})
    // public unitCategories: UnitCategory[]
}
