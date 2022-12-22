import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("equipment_categories")
export class EquipmentCategory {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column()
    public name: string;

    // @Column({ name: "army_id" })
    // public armyId: number;
}
