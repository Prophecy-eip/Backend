import { ArmyList } from "./army-list.entity";

export class ArmyListCredentialsDTO {
    constructor(list: ArmyList) {
        this.id = list.id;
        this.name = list.name;
        this.valuePoints = list.valuePoints;
        this.isShared = list.isShared;
        this.isFavorite = list.isFavorite;
        this.armyId = list.armyId;
    }
    public id: string;
    public name: string;
    public armyId: number;
    public valuePoints: number;
    public isShared: boolean;
    public isFavorite: boolean;
}
