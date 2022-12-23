import { ArmyOrganisationGroup } from "./group/army-organisation-group.entity";
import { ArmyOrganisation } from "./army-organisation.entity";

export class ArmyOrganisationDTO {
    constructor(organisation: ArmyOrganisation) {
        this.id = organisation.id;
        this.name = organisation.name;
        this.description = organisation.description;
        this.isDefault = organisation.isDefault;
        this.organisationGroups = organisation.groups;
    }

    public id: number;
    public name: string;
    public description: string;
    public isDefault: boolean;
    public organisationGroups: ArmyOrganisationGroup[];
}
