import { ProphecyArmy } from "@prophecy/army/prophecy-army.entity";

class ProphecyArmyDTO {

    constructor(prophecy: ProphecyArmy) {
        this.id = prophecy.id;
        this.armyList1 = prophecy.armyList1;
        this.armyList2 = prophecy.armyList2;
        this.player1Score = prophecy.player1Score;
        this.player1Score = prophecy.player1Score;
        this.player2Score = prophecy.player2Score;
    }

    public id: string;
    public armyList1: string;
    public armyList2: string;
    public player1Score: number;
    public player2Score: number;
}

export default ProphecyArmyDTO;
