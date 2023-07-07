import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("army_prophecies")
export class ProphecyArmy {
    @PrimaryColumn()
    public id: string;

    @Column()
    public owner: string;

    @Column({ name: "army_list_1"})
    public armyList1: string;

    @Column({ name: "army_list_2"})
    public armyList2: string;

    @Column({ name: "player_1_score", type: "int" })
    public player1Score: number;

    @Column({ name: "player_2_score", type: "int" })
    public player2Score: number;
}
