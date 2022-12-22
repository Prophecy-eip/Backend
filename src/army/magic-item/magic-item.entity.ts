import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("magic_items")
export class MagicItem {
    @PrimaryColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column({ name: "magic_item_category_id" })
    public magicItemCategoryId: number;

    // @Column({ name: "army_id" })
    // armyId: number;

    @Column({ name: "is_multiple" })
    public isMultiple: boolean;

    @Column()
    public max: number;

    @Column({ name: "is_dominant" })
    public isDominant: boolean;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column({ name: "value_points"})
    public valuePoints: number;

    @Column({ name: "foot_only" })
    public footOnly: boolean;

    @Column({ name: "disable_magic_path_limit" })
    public disableMagicPathLimit: boolean;

    @Column({ name: "wizard_only", array: true, type: "varchar" })
    public wizardOnly: string[];

    @Column({ name: "required_organisation_ids", type: "int", array: true })
    public requiredOrganisationIds: number[];
}
