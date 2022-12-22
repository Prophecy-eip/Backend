import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("magic_item_categories")
export class MagicItemCategory {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column()
    public name: string;

    @Column({ name: "is_multiple" })
    public isMultiple: boolean;

    @Column()
    public max: number;

    @Column({ name: "army_id" })
    public armyId: number;
    // @Column({ name: "item_id" })
    // public itemId: number;
}
