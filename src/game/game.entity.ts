import { Column, Entity, JoinColumn, PrimaryColumn } from "typeorm";

@Entity("games")
export class Game {
    @PrimaryColumn()
    public id: string;

    @Column({ type: "varchar" })
    @JoinColumn({ name: "profiles", referencedColumnName: "id" })
    public owner: string;

    @Column({ type: "varchar", nullable: true })
    @JoinColumn({ name: "profiles", referencedColumnName: "id" })
    public opponent: string | null;

    @Column({ name: "owner_score", type: "int" })
    public ownerScore: number;

    @Column({ name: "opponent_score", type: "int" })
    public opponentScore: number;

    @Column({ name: "owner_army_list", nullable: true, type: "varchar" })
    @JoinColumn( { name: "army_lists", referencedColumnName: "id" })
    public ownerArmyList: string | null;

    @Column({ name: "opponent_army_list", nullable: true, type: "varchar" })
    @JoinColumn( { name: "army_lists", referencedColumnName: "id" })
    public opponentArmyList: string | null;
}
