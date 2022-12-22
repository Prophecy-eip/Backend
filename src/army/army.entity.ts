import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("armies")
export class Army {
    @PrimaryColumn()
    public id: number;

    @Column()
    public name: string;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column({ name: "category_id" })
    public categoryId: number;

    @Column()
    public source: string;

    @Column({ name: "equipment_limits" })
    public equipmentLimits: string;

    @Column({ name: "special_rule_limits" })
    public specialRuleLimits: string;

    @Column({ name: "organisation_ids", type: "int", array: true })
    public organisationIds: number[];

    @Column({ name: "magic_item_category_ids", type: "int", array: true })
    public magicItemCategoryIds: number[];

    @Column({ name: "magic_item_ids", type: "int", array: true })
    public magicItemIds: number[];

    @Column({ name: "magic_standard_ids", type: "int", array: true })
    public magicStandardIds: number[];

    @Column({ name: "equipment_ids", type: "int", array: true })
    public equipmentIds: number[];

    @Column({ name: "rule_ids", type: "int", array: true })
    public ruleIds: number[];

    @Column({ name: "unit_ids", type: "int", array: true })
    public unitIds: number[];
}
