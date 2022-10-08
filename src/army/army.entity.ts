import {AfterLoad, Column, Entity, JoinColumn, OneToMany, PrimaryColumn} from "typeorm"
import { UnitCategory } from "./unit/unit-category/unit-category.entity";

@Entity("armies")
export class Army {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({ name: "unit_categories" })
    public unitCategories: string;

    @Column()
    public rules: string;

    @Column({ name: "upgrade_categories" })
    public upgradeCategories: string;

    @Column({ name: "special_item_categories" })
    public specialItemCategories: string;

    @Column()
    public units: string;

    @Column()
    public upgrades: string;

    @Column()
    public items: string;

    public unitCategoryIds: string[]

    @AfterLoad()
    private loadIds() {
        
    }

}
