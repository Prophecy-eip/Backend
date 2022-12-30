import { Entity, PrimaryColumn, Column } from "typeorm";

class ArmyOrganisationGroupLimit {
    id: number;
    army_organisation_group_id: number;
    points_min: number;
        points_max: number;
    target: string;
    value: number;
    repeat_interval: number;
    repeat_value: number;
}

class ArmyOrganisationUnitLimit {
    public id: number;
    public unit_min: number;
    public unit_max: number;
    public model_max: number;
    public unit_ids: number[];
    public availabilities: number[]
}
@Entity("army_organisation_groups")
export class ArmyOrganisationGroup {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "army_organisation_id" })
    public armyOrganisationId: number;

    @Column()
    public name: string;

    @Column({ type: "json", name: "organisation_group_limits", array: true })
    public organisationGroupLimits: ArmyOrganisationGroupLimit[];

    @Column({ type: "json", name: "organisation_unit_limits", array: true})
    public organisationUnitLimits: ArmyOrganisationUnitLimit[];

    @Column({ type: "varchar", name: "change_item_limits" })
    public changeItemLimits: string;
}
