import { Entity, PrimaryColumn, Column } from "typeorm";

// export class Limit {
//     public target: string;
//     public value: number;
//     public unit: string;
// }

@Entity("army_organisations")
export class ArmyOrganisation {
    @PrimaryColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column({ name: "is_default" })
    public isDefault: boolean;

    // @Column({ name: "army_id" })
    // public armyId: number;

    @Column({ name: "organisation_group_ids", type: "int", array: true})
    public organisationGroupIds: number[];
}
