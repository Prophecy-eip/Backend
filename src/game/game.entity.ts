import { Column, Entity, JoinColumn, PrimaryColumn } from "typeorm";

/**
 * @class Game
 * @brief Entity that represents a game's data in the database
 * @member id The game's id
 * @member owner The game's owner's username
 * @member opponent The player's opponent's username
 * @member owner The owner's score
 * @member opponentScore The opponent's score
 * @member ownerArmyList The player's army list's id
 * @member opponentArmyList The opponent's army list's id
 */
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
