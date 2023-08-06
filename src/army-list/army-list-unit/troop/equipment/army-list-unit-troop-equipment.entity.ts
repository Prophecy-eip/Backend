import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import { Equipment } from "@army/equipment/equipment.entity";

@Entity("army_list_unit_troop_equipments")
export class ArmyListUnitTroopEquipment {
    @PrimaryColumn()
    public id: string;

    @ManyToOne(() => ArmyListUnit, (armyListUnit: ArmyListUnit) => armyListUnit.equipmentTroops)
    @JoinColumn({ name: "army_list_unit_id" })
    public armyListUnit: ArmyListUnit;

    @Column({ name: "troop_id" })
    public troopId: number;

    @ManyToOne(() => Equipment)
    @JoinColumn({ name: "equipment_id" })
    public equipment: Equipment;
}
