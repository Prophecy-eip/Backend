import { Army } from "./army.entity";

export class ArmyCredentialsDTO {
    constructor(army: Army) {
        this.id = army.id;
        this.name = army.name;
    }

    public id: number;
    public name: string;
}
