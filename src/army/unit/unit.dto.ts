import { UnitProfileDTO } from "./unit-profile/unit-profile.dto";
import { OptionDTO } from "../option/option.dto";
import {Unit} from "./unit.entity";
import {UnitProfile} from "./unit-profile/unit-profile.entity";

export class UnitDTO {
    constructor(unit: Unit, unitProfiles: UnitProfile[]) {
        this.id = unit.id;
        this.name = unit.name;
        this.category = unit.category;
        this.cost = unit.cost;
        this.profiles = []
        unitProfiles.forEach((profile) => {
           this.profiles.push(new UnitProfileDTO(profile))
        });
        // this.options
    }

    id: string;
    name: string;
    profiles: UnitProfileDTO[];
    category: string;
    cost: string;
    options: OptionDTO[];
}
