import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("special_item_categories")
export class SpecialItemCategory {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({name: "is_collective"})
    public isCollective: boolean;

    @Column()
    public limits: string;

    @Column({ name: "items" })
    public itemsIds: string;
}
