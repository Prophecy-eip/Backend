import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("rules")
export class Rule {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column()
    public description: string;
}