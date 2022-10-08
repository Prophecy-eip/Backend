import { UnitProfileDTO } from "./unit-profile/unit-profile.dto";
import { OptionDTO } from "../option/option.dto";
import { Unit } from "./unit.entity";
import { UnitProfile } from "./unit-profile/unit-profile.entity";
import { Option } from "../option/option.entity";

export class UnitDTO {
    constructor(unit: Unit, unitProfiles: UnitProfile[], options: Option[]) {
        this.id = unit.id;
        this.name = unit.name;
        this.category = unit.category;
        this.cost = unit.cost;
        this.profiles = []
        unitProfiles.forEach((profile) => {
           this.profiles.push(new UnitProfileDTO(profile))
        });
        this.options = []
        options.forEach((option) => {
            this.options.push(new OptionDTO(option))
        });
        console.log(options)
    }

    id: string;
    name: string;
    profiles: UnitProfileDTO[];
    category: string;
    cost: string;
    options: OptionDTO[];
}
