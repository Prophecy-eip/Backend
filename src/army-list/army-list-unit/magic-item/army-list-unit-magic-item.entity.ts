import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("army_list_units_magic_items")
export class ArmyListUnitMagicItem {
    @PrimaryColumn()
    public id: string;

    @Column({ name: "army_list_unit_id" })
    public armyListUnitId: string;

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
}
