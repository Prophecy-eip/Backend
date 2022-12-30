import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("equipment_unit_troops")
export class EquipmentUnitTroop {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "unit_id" })
    public unitId: number;

    @Column({ name: "troop_id" })
    public troopId: number;

    @Column()
    public info: string;

    @Column({ name: "equipment_id" })
    public equipmentId: number;

    @Column({ name: "type_lvl" })
    public typeLvl: string;

    @Column()
    public name: string;
}
