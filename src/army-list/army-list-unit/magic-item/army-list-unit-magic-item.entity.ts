import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { MagicItem } from "@army/magic-item/magic-item.entity";
import { UnitOption } from "@army/unit/option/unit-option.entity";
import { Equipment } from "@army/equipment/equipment.entity";

@Entity("army_list_units_magic_items")
export class ArmyListUnitMagicItem {
    @PrimaryColumn()
    public id: string;

    @Column({ name: "unit_id", type: "int" })
    public unitId: number;

    @ManyToOne(() => MagicItem)
    @JoinColumn({ name: "magic_item_id" })
    public magicItem: MagicItem;

    @ManyToOne(() => UnitOption)
    @JoinColumn({ name: "unit_option_id" })
    public unitOption: UnitOption;

    @ManyToOne(() => Equipment)
    @JoinColumn({ name: "equipment_id" })
    public equipment: Equipment;

    @Column()
    public quantity: number;

    @Column({ name: "value_points" })
    public valuePoints: number;

    @ManyToOne(() => ArmyListUnit, (unit: ArmyListUnit) => unit.magicItems)
    @JoinColumn({ name: "army_list_unit_id" })
    public armyListUnit: ArmyListUnit;
}
