import {Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryColumn, ManyToOne} from "typeorm";

@Entity("modifiers")
export class Modifier {
    @PrimaryColumn()
    public id: string;

    @Column()
    public type: string;

    @Column()
    public value: string;

    @Column()
    public field: string;

    @Column()
    public conditions: string;
}