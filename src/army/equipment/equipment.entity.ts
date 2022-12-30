import { AfterLoad, Column, Entity, PrimaryColumn } from "typeorm";
import { EquipmentCategory } from "./category/equipment-category.entity";
import { ProphecyDatasource } from "../../database/prophecy.datasource";

@Entity("equipments")
export class Equipment {
    @PrimaryColumn()
    public id: number;

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
    public equipmentCategoriesIds: number[];

    public equipmentCategories: EquipmentCategory[] = [];

    @AfterLoad()
    private async load() {
        if (this.equipmentCategoriesIds === null) {
            return;
        }
        let datasource: ProphecyDatasource = new ProphecyDatasource();

        await datasource.initialize();
        for (const id of this.equipmentCategoriesIds)
            this.equipmentCategories.push(await datasource.getRepository(EquipmentCategory).findOneBy({ id: id }));
        await datasource.destroy();
    }
}
