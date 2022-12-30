import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("army_list_unit_troop_equipments")
export class ArmyListUnitTroopEquipment {
    @PrimaryColumn()
    public id: string;

    @Column({ name: "army_list_unit_id" })
    public armyListUnitId: string;

    @Column({ name: "troop_id" })
    public troopId: number;

    @Column({ name: "equipment_id" })
    public equipmentId: number;
}
