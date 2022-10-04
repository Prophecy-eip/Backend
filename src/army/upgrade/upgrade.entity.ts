import {Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryColumn, ManyToOne} from "typeorm";


@Entity("upgrades")
export class Upgrade {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({name: "is_collective"})
    public isCollective: string;

    @Column()
    public conditions: string;

    @Column()
    public cost: string;

    @Column()
    public modifiers: string;

    @Column()
    public profiles: string;

    @Column()
    public rules: string;

    @Column()
    public army: string;
}