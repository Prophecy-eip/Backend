import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";

@Entity("army_list_units_magic_items")
export class ArmyListUnitMagicItem {
    @PrimaryColumn()
    public id: string;

    @Column({ name: "unit_id", type: "int" })
    public unitId: number;

    @Column({ name: "magic_item_id", type: "int" })
    public magicItemId: number;

    @Column({ name: "unit_option_id"})
    public unitOptionId: number;

    @Column({ name: "equipment_id" })
    public equipmentId: number;

    @Column()
    public quantity: number;

    @Column({ name: "value_points" })
    public valuePoints: number;

    @ManyToOne(() => ArmyListUnit, (unit: ArmyListUnit) => unit.magicItems)
    @JoinColumn({ name: "army_list_unit_id" })
    public armyListUnit: ArmyListUnit;
}
