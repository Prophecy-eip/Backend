import {Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryColumn, ManyToOne} from "typeorm";

@Entity("options")
export class Option {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column()
    public type: string;

    @Column()
    public limits: string;

    @Column()
    public cost: string;

    @Column()
    public modifiers: string;
}