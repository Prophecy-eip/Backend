import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ArmyList } from "@army-list/army-list.entity";

@Entity("army_prophecies")
export class ProphecyArmy {
    @PrimaryColumn()
    public id: string;

    @Column()
    public owner: string;

    @ManyToOne(() => ArmyList)
    @JoinColumn({ name: "army_list_1"})
    public armyList1: ArmyList;

    @ManyToOne(() => ArmyList)
    @JoinColumn({ name: "army_list_2"})
    public armyList2: ArmyList;

    @Column({ name: "player_1_score", type: "int" })
    public player1Score: number;

    @Column({ name: "player_2_score", type: "int" })
    public player2Score: number;
}
