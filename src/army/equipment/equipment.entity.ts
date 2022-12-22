import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("equipments")
export class Equipment {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "army_id" })
    public armyId: number;

    @Column({ name: "version_id"})
    public versionId: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column({ name: "type_lvl" })
    public typeLvl: string;

    @Column({ name: "can_be_enchanted"})
    public canBeEnchanted: boolean;

    @Column({ name: "equipment_categories", type: "int", array: true })
    public equipmentCategories: number[];
}
