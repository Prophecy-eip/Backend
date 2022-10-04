import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("units")
export class Unit {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({type: "varchar"})
    public army: string;

    @Column({type: "varchar"})
    public category: string;

    @Column()
    public cost: string;

    @Column()
    public options: string;

    @Column({type: "varchar", name: "profiles"})
    public profiles: string;
}
