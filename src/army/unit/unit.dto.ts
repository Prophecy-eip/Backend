import { UnitProfileDTO } from "./unit-profile/unit-profile.dto";
import { Unit } from "./unit.entity";
import { OptionDTO } from "../option/option.dto";

export class UnitDTO {
    constructor(unit: Unit) {
        this.id = unit.id;
        this.name = unit.name;
        this.category = unit.category;
        this.cost = unit.cost;
        for (const profile of unit.profiles)
            this.profiles.push(new UnitProfileDTO(profile));
        for (const option of unit.options)
            this.options.push(new OptionDTO(option));
    }

    id: string;
    name: string;
    profiles: UnitProfileDTO[] = [];
    category: string;
    cost: string;
    options: OptionDTO[] = [];
}
