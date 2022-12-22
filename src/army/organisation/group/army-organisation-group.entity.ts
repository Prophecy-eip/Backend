import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("army_organisation_groups")
export class ArmyOrganisationGroup {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "army_organisation_id" })
    public armyOrganisationId: number;

    @Column()
    public name: string;

    @Column({ type: "varchar", name: "organisation_group_limits", array: true })
    public organisationGroupLimits: string;

    @Column({ type: "varchar", name: "organisation_unit_limits"})
    public organisationUnitLimits: string;

    @Column({ type: "varchar", name: "change_item_limits" })
    public changeItemLimits: string;
}
