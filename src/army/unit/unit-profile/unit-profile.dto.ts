import { UnitProfile } from "./unit-profile.entity";

export class UnitProfileDTO {
    constructor(profile: UnitProfile) {
        this.id = profile.id;
        this.name = profile.name;
        this.characteristics = profile.characteristics;
    }

    id: string;
    name: string;
    characteristics: string;
}
