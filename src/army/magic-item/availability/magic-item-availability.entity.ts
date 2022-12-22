import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("magic_item_availabilities")
export class MagicItemAvailability {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "unit_type_id" })
    public unitTypeId: number;

    @Column({ name: "unit_id" })
    public unitId: number;

    @Column({ name: "unit_option_id" })
    public unitOptionId: number;

    @Column()
    public size: string;

    @Column({ name: "special_rule_id" })
    public specialRuleId: number;

    @Column()
    public action: string;

    @Column({ name: "magic_item_id" })
    public magic_item_id: number;
}
