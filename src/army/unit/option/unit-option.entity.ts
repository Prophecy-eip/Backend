import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("unit_options")
export class UnitOption {
    @PrimaryColumn()
    public id: string;

    @Column({ name: "unit_id" })
    public unitId: number;

    @Column({ name: "parent_id" })
    public parentId: number;

    @Column()
    public category: string;

    @Column({ name: "magic_item_factor" })
    public magicItemFactor: number;

    @Column({ name: "army_organisation_activator_id"})
    public armyOrganisationActivatorId: number;

    @Column({ name: "army_organisation_desactivator_id"})
    public armyOrganisationDesactivatorId: number;

    @Column({ name: "use_all_activators" })
    public useAllActivators: boolean;

    @Column({ name: "army_organisation_id" })
    public armyOrganisationId: number;

    @Column({ name: "is_per_model" })
    public isPerModel: boolean;

    @Column({ name: "is_foot_only" })
    public isFootOnly: boolean;

    @Column( { name: "mount_id" })
    public mount_id: number;

    @Column({ name: "mount_and_characteristics_points" })
    public mountAdnCharacteristicsPoints: boolean;

}