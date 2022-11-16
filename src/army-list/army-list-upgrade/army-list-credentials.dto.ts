import { ArmyList } from "../army-list.entity";

export class ArmyListCredentialsDTO {
    constructor(list: ArmyList) {
        this.id = list.id;
        this.name = list.name;
        this.army = list.army;
        this.cost = list.cost;
        this.isShared = list.isShared;
    }

    public id: string;
    public name: string;
    public army: string;
    public cost: string;
    public isShared: boolean;
}
