import { Column, Entity, PrimaryColumn } from "typeorm";

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
    public limits: string;
}