import { Column, Entity, PrimaryColumn } from "typeorm";
import { JoinColumn } from "typeorm";

@Entity("army_lists")
export class ArmyList {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({ type: "varchar" })
    @JoinColumn({ name: "profiles", referencedColumnName: "id" })
    public owner: string;

    @Column({ name: "army_id", type: "int" })
    @JoinColumn({ name: "armies", referencedColumnName: "id"})
    public armyId: number;

    @Column({ name: "value_points" })
    public valuePoints: number;

    @Column({ name: "is_shared" })
    public isShared: boolean;

    @Column({ name: "is_favourite" })
    public isFavorite: boolean;
}
