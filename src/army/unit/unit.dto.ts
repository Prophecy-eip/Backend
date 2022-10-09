import { UnitProfileDTO } from "./unit-profile/unit-profile.dto";
import { OptionDTO } from "../option/option.dto";
import { Unit } from "./unit.entity";
import { UnitProfile } from "./unit-profile/unit-profile.entity";
import { Option } from "../option/option.entity";

export class UnitDTO {
    constructor(unit: Unit) {
        this.id = unit.id;
        this.name = unit.name;
        this.category = unit.category;
        this.cost = unit.cost;
        for (let i = 0; i < unit.profiles.length; i++)
            this.profiles.push(new UnitProfileDTO(unit.profiles[i]));
        this.options = unit.options;
    }


    id: string;
    name: string;
    profiles: UnitProfileDTO[] = [];
    category: string;
    cost: string;
    options: Option[] = [];
}
