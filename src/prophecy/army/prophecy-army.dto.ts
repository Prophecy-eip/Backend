import { ProphecyArmy } from "@prophecy/army/prophecy-army.entity";

export class ProphecyArmyDTO {

    constructor(prophecy: ProphecyArmy) {
        this.armyList1 = prophecy.armyList1.id;
        this.armyList2 = prophecy.armyList2.id;
        this.player1Score = prophecy.player1Score;
        this.player2Score = prophecy.player2Score;
    }

    public armyList1: string;
    public armyList2: string;
    public player1Score: number;
    public player2Score: number;
}

export class ProphecyArmyWithIdDTO extends ProphecyArmyDTO {
    constructor(prophecy: ProphecyArmy) {
        super(prophecy);
        this.id = prophecy.id;
    }

    public id: string;
}

