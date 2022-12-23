import { Entity, PrimaryColumn, Column, AfterLoad } from "typeorm";

import { ArmyOrganisationGroup } from "./group/army-organisation-group.entity";
import { ProphecyDatasource } from "../../database/prophecy.datasource";

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

    @Column({ name: "organisation_group_ids", type: "int", array: true})
    public organisationGroupIds: number[];

    public groups: ArmyOrganisationGroup[] = [];

    @AfterLoad()
    private async load() {
        let datasource: ProphecyDatasource = new ProphecyDatasource();

        await datasource.initialize();
        for (const id of this.organisationGroupIds) {
            this.groups.push(await datasource.getRepository(ArmyOrganisationGroup).findOneBy({ id: id }));
        }
        await datasource.destroy();
    }
}
